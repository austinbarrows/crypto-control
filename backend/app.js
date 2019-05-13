const net = require("net");
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const fs = require('fs');
const path = require('path');
const node_ssh = require('node-ssh')
const flatten = require('flat')
const ssh = new node_ssh();
const fsPromises = require('fs').promises;
const pscp = require("./lib/pscp"); // Custom made PSCP wrapper
const request = require('request-promise-native'); // should be rp instead of request, but request is more readable IMO
const cors = require('cors');

let globals = {
  commands: {
    stats: "{\"command\" : \"stats\"}",
    pools: "{\"command\" : \"pools\"}",
    restart: "{\"command\" : \"restart\"}"
  }
};

//Express setup
//app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use("/", express.static(__dirname + "/dist/crypto-control"));
app.use(cors());

//Mongoose/MongoDB setup
mongoose.connect("mongodb://localhost/miner_monitor");
let minerSchema = new mongoose.Schema({
  name: String,
  ip: String,
  port: Number,
  timedOutOnLastQuery: Boolean,
  commands: {
    stats: Object,
    pools: Object
  }
});

let Miner = mongoose.model("Miner", minerSchema);

async function deleteEntireDB() {
  // WARNING: Dangerous function, deletes ALL DATA FROM DB

  await Miner.deleteMany({});
  console.log("DB deleted");
  return Miner.find({});
};

async function callMinerAPI(ip, port, query) {
  // Refreshes data for one IP

  return new Promise((resolve, reject) => {
    // Create new socket
    let socket = new net.Socket();
    let socketData = "";
    let wasTimeout = false;
    let wasError = false;

    // Set decoding from bytes to UTF-8
    socket.setEncoding("UTF-8");

    // Set timeout to 1 second, as miners will respond in less than 1 second
    // if they are up
    socket.setTimeout(1000);

    // Connect to the TCP socket and send a request for data
    socket.connect(port, ip, function(){
      console.log("Connected to " + ip + ":" + port);
      // Write the query to the specified ip and port
      socket.write(query);
    });

    // Deal with any timeouts, most likely issue is that the machine is down
    socket.on("timeout", function() {
      console.log("Connection timed out on IP: " + ip + ", miner likely down");
      wasTimeout = true;
      // Destroy socket to clean up
      socket.destroy();
    });

    // Deal with any non-timeout errors
    socket.on("error", function() {
      console.log("Error occurred on IP: " + ip);
      wasError = true;
      // Destroy socket to clean up
      socket.destroy();
    });

    // When the data is received, add it to a string
    socket.on("data", function(data){
      /**
       * Reason += is used instead of = is because of an error with Antminer S9s
       * where the response data is sent in two different chunks that need to be
       * combined into one set of data; += is simply the cleanest and most
       * applicable way to achieve a complete dataset for all responses.
       */
      socketData += data;
    });

    // Once the socket is closed, clean up the data and update the database
    socket.on("close", async function() {
      // Create return object
      let returnObj = {};

      // As long as there was no timeout and no error, create responseData key
      // in the return object
      if (!wasTimeout && !wasError) {
        console.log("Disconnected from " + ip + ":" + port);
        console.log("-------- RESPONSE FROM API --------")
        console.log(socketData);
        console.log("---------- END RESPONSE -----------")

        returnObj.data = socketData;
        returnObj.timedOutOnLastQuery = false;
        // Resolve promise
        resolve(returnObj);
      } else {
        returnObj.timedOutOnLastQuery = true;
        // Resolve promise
        resolve(returnObj);
      }
    });
  });
};

async function callMinerAPIandPrepareData(ip, port, query) {
  // Get response from miner API
  let response = await callMinerAPI(ip, port, query);
  // Prepare response data
  response = await prepareData(response, query);
  // Return the prepared data
  return response;
};

async function fixJSON(data) {
  /**
   * A function designed to correct for a small error in the JSON formatting
   * of the response given by AntMiners.
   *
   * Detailed: AntMiners use a customized version of CGMiner where the response
   * of the "stats" command is modified to provide more information about the
   * machine; however, the JSON sent back consistently contains the error of
   * a missing comma specifically after the second closing curly brace. This
   * function adds that missing comma.
   */
  let nth = 0;
  data = data.replace(/\}/g, function(match) {
    nth++;
    return (nth === 2) ? "}," : match;
  });
  return data;
};

async function removeNullBytes(data) {
  // Remove all null bytes from the response (using a regex)
  data = data.replace(/\0/g, "");
  return data;
};

async function turnToObject(data, query) {
  /**
   * A collection of function calls that, overall, clean up the API response to
   * allow it to be used in other code as an object.
   */
  if (query === globals.commands.stats) {
    data = await fixJSON(data);
  }
  data = await removeNullBytes(data);
  data = await JSON.parse(data);
  return data;
};

async function prepareData(response, query) {
  /*
   * Prepares the data from one API response to be saved into the database.
   * Operations are performed to change the data into an object and add extra
   * data to the object based on the API query and the corresponding response.
  */

  // Create data object containing a commands object
  let data = {commands: {}};

  // Assign timedOutOnLastQuery from old data to new data
  data.timedOutOnLastQuery = response.timedOutOnLastQuery;

  // If the request timed out on last query, simply return data with an
  // empty commands object and the timedOutOnLastQuery attribute
  if (data.timedOutOnLastQuery === true) {
    return data;
  }
  // If request did not time out on last query
  else {
    // Create local reference to responseData
    let responseData = response.data;

    // Turn the response data into an object by first purifying it from the
    // messy string form, then parsing it into an object
    let purifiedData = await turnToObject(responseData, query);

    // If the query was stats
    if (query === globals.commands.stats) {
      // Add the percent of 'healthy' chips to the stats data
      data.commands.stats = await percentOfChips(purifiedData);
      return data;
    }
    // If the query was pools, assign response and return
    else if (query === globals.commands.pools) {
      data.commands.pools = purifiedData;
      return data;
    }
  }
};

async function refreshStatsAndPools(id) {
  let currentMiner = await Miner.findById(id);
  console.log("----------- CURRENT MINER ------------");
  console.log(currentMiner);
  console.log("------------- END MINER --------------");

  let ip = currentMiner.ip;
  let port = currentMiner.port;
  let name = currentMiner.name;
  let data = {
    commands: {}
  };

  let stats = await getStats(ip, port);
  let pools = await getPools(ip, port);

  data.commands.stats = stats.commands.stats;
  data.commands.pools = pools.commands.pools;
  data.timedOutOnLastQuery = pools.timedOutOnLastQuery;

  console.log("----------- DATA START ------------");
  console.log(data);
  console.log("------------ DATA END -------------");

  let dataFlattened = flatten(data, {maxDepth: 2});
  console.log("---------- FLATTENED DATA ----------")
  console.log(dataFlattened);
  console.log("---------- END FLATTENED -----------")

  await Miner.findByIdAndUpdate(id, { $set: dataFlattened }, function(err, match){
    console.log(name + " updated");
  });
  return;
};

async function getStats(ip, port) {
  let stats = await callMinerAPIandPrepareData(ip, port, globals.commands.stats);
  return stats;
}

async function getPools(ip, port) {
  let pools = await callMinerAPIandPrepareData(ip, port, globals.commands.pools);
  return pools;
}

async function refreshAll() {
  // Refresh data for all miners

  console.log("XXXXXXXXXXXXXXXXXXXXXXXXXXXX START OF MINERS UPDATE XXXXXXXXXXXXXXXXXXXXXXXXXXXX");
  let ids = [];
  let refreshes = [];

  // Create an array of names by finding all miners in the DB and adding their
  // names to the array

  await Miner.find({}, function(err, miners){
    for (let i = 0; i < miners.length; i++) {
      console.log(miners[i]);
      ids.push(miners[i]._id);
    }
  });

console.log(ids);
  // Create an array of promises representing the refreshed data for each miner
  for (let i = 0; i < ids.length; i++) {
    refreshes.push(refreshStatsAndPools(ids[i]));
  }

  // Wait for data to refresh for all miners
  await Promise.all(refreshes);
};

async function refreshAllMiddleware(req, res, next) {
  await refreshAll();
  // Pass request handling to next function after data is refreshed
  next();
};

async function refreshOne(req, res, next) {
  let id = req.params.databaseID;
  let refreshed = await refreshStatsAndPools(id);
  console.log(refreshed);
  next();
}

async function findAll() {
  // Find all miners from DB and return them
  let miners = await Miner.find({});
  return miners;
};

async function findAllMiddleware(req, res, next) {
  let miners = await findAll();
  // Assign miners to a locals object attached to the request object
  req.locals = {};
  req.locals.miners = miners;
  // Pass request handling to next function
  next();
};

async function getConfig(localPath, confType, ip, ignoreHostKey) {
  let remotePath = "/config/" + confType;
  let options = {
    ignoreHostKey: ignoreHostKey,
    localPath: localPath,
    remotePath: remotePath,
    user: "root",
    pass: "admin",
    host: ip,
    port: "22",
    forceProtocol: "scp"
  };
  //console.log(options);
  let result = await pscp.get(options);
  console.log(result);
};

async function putConfig(localPath, confType, ip, ignoreHostKey) {
  let remotePath = "/config/" + confType;
  let options = {
    ignoreHostKey: ignoreHostKey,
    localPath: localPath,
    remotePath: remotePath,
    user: "root",
    pass: "admin",
    host: ip,
    port: "22",
    forceProtocol: "scp"
  };
  //console.log(options);
  let result = await pscp.put(options);
  console.log(result);
};

async function restartMiningSoftware(ip, port) {
  let query = globals.commands.restart;
  let response = await callMinerAPI(ip, port, query);
  let data = await turnToObject(response.data);
  return data;
};

async function switchPool(id, poolURL, poolUser, poolPass) {
  let miner = await Miner.findById(id);

  let ip = miner.ip;
  let port = miner.port;

  let {confType, path} = await determineConfByType(miner);

  let config = await fsPromises.readFile(path, {encoding: "utf8"});
  config = await JSON.parse(config);

  config.pools[0].url = poolURL;
  config.pools[0].user = poolUser;
  config.pools[0].pass = poolPass;
  config["api-groups"] = "A:stats:pools:devs:summary:version:restart";

  config = await JSON.stringify(config);
  let configFileHandle = await fsPromises.open(path, "w");
  await configFileHandle.writeFile(config, "utf8");
  await configFileHandle.close();

  let ignoreHostKey = true;
  await putConfig(path, confType, ip, ignoreHostKey);
  let restartResponseObj = await restartMiningSoftware(ip, port);
  try {
    if (restartResponseObj["STATUS"][0]["STATUS"] === "E") {
      await restartMiner(id);
    }
  } catch (err) {
    console.log(err);
  }

  console.log("Pool switched for " + miner.name);
};

async function switchPoolMiddleware(req, res, next) {
  let id = req.params.databaseID;
  let poolURL = req.body.poolURL;
  let poolUser = req.body.poolUser;
  let poolPass = req.body.poolPass;
  await switchPool(id, poolURL, poolUser, poolPass);
  next();
};

async function determineConfByType(miner) {
  let typeID = miner.commands.stats.STATS[1].ID;
  let name = miner.name;
  let confType;
  let path;

  if (typeID === "BC50") {
    confType = "bmminer.conf";
    path = "miner_files/" + miner._id + "_" + confType;
  } else if (typeID === "L30") {
    confType = "cgminer.conf";
    path = "miner_files/" + miner._id + "_" + confType;
  } else if (typeID === "D10") {
    confType = "cgminer.conf";
    path = "miner_files/" + miner._id + "_" + confType;
  }

  return {confType, path};
};

async function addConfig(miner) {
  let ip = miner.ip;
  let {confType, path} = await determineConfByType(miner);

  let ignoreHostKey = true;
  await getConfig(path, confType, ip, ignoreHostKey);

  let config = await fsPromises.readFile(path, {encoding: "utf8"});
  config = await JSON.parse(config);
  // Adds restart command to commands group to enable restartMiningSoftware
  config["api-groups"] = "A:stats:pools:devs:summary:version:restart";
  config = await JSON.stringify(config);

  let configFileHandle = await fsPromises.open(path, "w");
  await configFileHandle.writeFile(config, "utf8");
  await configFileHandle.close();
  await putConfig(path, confType, ip, ignoreHostKey);

  // Restart miner to enable config changes
  await restartMiner(miner._id);
  return true;
}

async function addMiner(name, ip) {
  let minersByIP = await Miner.find({"ip" : ip});

  if (minersByIP.length == 0) {
    let port = 4028;
    let newMiner = await Miner.create({"name" : name, "ip" : ip, "port": port});
    console.log("New database entry created for name: " + name + ", ip: " + ip);

    await refreshStatsAndPools(newMiner._id);
    let miner = await Miner.findById(newMiner._id);
    await addConfig(miner);
  }
  else {
    let name = minersByIP[0].name;
    console.log("Miner already in database (" + name + ", " + ip + ")");
    // TODO: Tell user "miner already in DB"
  }
};

async function addMinerMiddleware(req, res, next) {
  let ip = req.body.ip;
  let name = req.body.name;
  await addMiner(name, ip);
  next();
};

async function removeMiner(id) {
  let miner = await Miner.findByIdAndDelete(id);
  console.log(miner.name + " removed from database");
};

async function removeMinerMiddleware(req, res, next) {
  let id = req.body.databaseID;
  await removeMiner(id);
  next();
};

async function percentOfChips(stats) {
  let live = 0;
  let dead = 0;
  let chainList = [];
  let i = 1;
  let j;

  while (true) {
    j = i - 1;
    if (stats.STATS[1]["chain_acs" + i] == undefined) {
      break;
    }
    chainList[j] = stats.STATS[1]["chain_acs" + i];
    live += (chainList[j].match(/o/g) || []).length;
    dead += (chainList[j].match(/x/g) || []).length;
    i++;
  }
  let total = live + dead;
  let percentage = (live / total).toFixed(4);
  stats.STATS[1]["Chip%"] = percentage;
  return stats;
};

async function restartMiner(id) {
  let miner = await Miner.findById(id);

  let ip = miner.ip;
  let username = "root";
  let password = "admin";

  await ssh.connect({
    host: ip,
    username: username,
    password,
    tryKeyboard: true,
    onKeyboardInteractive: (id, instructions, instructionsLang, prompts, finish) => {
      if (prompts.length > 0 && prompts[0].prompt.toLowerCase().includes('password')) {
        finish([password])
      }
    }
  });

  ssh.execCommand("/sbin/reboot -f > /dev/null 2>&1 &", { cwd:'/' }).then(function(result) {
    //TODO: Try replacing command param with "/sbin/reboot -f > /dev/null 2>&1 &" for AntMiners
    //Command param verified functional: "echo '" + password + "' | sudo -S reboot"
    //
    console.log(miner.name + " restarted");
  });
};

async function restartMinerMiddleware(req, res, next) {
  let id = req.params.databaseID;
  await restartMiner(id);
  next();
};

async function getAllPasswords() {
  let miners = await Miner.find({});
  let passwords = {};
  for (let i = 0; i < miners.length; i++) {
    try {
      let id = miners[i]._id;

      let {confType, path} = await determineConfByType(miners[i]);

      let config = await fsPromises.readFile(path, {encoding: "utf8"});
      config = await JSON.parse(config);
      console.log(config);
      let poolPass = config.pools[0].pass;
      passwords[id] = poolPass;
    }
    catch (error) {
      if (error.code === "ENOENT") {
        await addConfig(miners[i]);
        await restartMiner(miners[i]._id);
      } else {
        console.log(error);
      }
    }
  }
  return passwords;
};

async function getAllPasswordsMiddleware(req, res, next) {
  req.locals.passwords = await getAllPasswords();
  next();
};

async function whattomineAPICall() {
  console.log(new Date().toLocaleString("en-US", { timezone: "EDT"}));
  let url = `https://whattomine.com/asic.json?utf8=%E2%9C%93&sha256f=true&factor%5Bsha256_hr%5D=13840&factor%5Bsha256_p%5D=1510&scryptf=true&factor%5Bscrypt_hash_rate%5D=530&factor%5Bscrypt_power%5D=1063&x11f=true&factor%5Bx11_hr%5D=20125&factor%5Bx11_p%5D=1396&bk2bf=true&factor%5Bbk2b_hr%5D=888&factor%5Bbk2b_p%5D=1600&factor%5Bqk_hr%5D=3300.0&factor%5Bqk_p%5D=120.0&factor%5Bqb_hr%5D=3300.0&factor%5Bqb_p%5D=130.0&factor%5Bmg_hr%5D=3.3&factor%5Bmg_p%5D=50.0&factor%5Bsk_hr%5D=1.7&factor%5Bsk_p%5D=40.0&factor%5Blbry_hr%5D=20.0&factor%5Blbry_p%5D=200.0&factor%5Bbk14_hr%5D=80.0&factor%5Bbk14_p%5D=205.0&factor%5Bpas_hr%5D=20.0&factor%5Bpas_p%5D=105.0&factor%5Bx11g_hr%5D=0.45&factor%5Bx11g_p%5D=70.0&factor%5Bcn_hr%5D=55.0&factor%5Bcn_p%5D=140.0&factor%5Bcost%5D=0.075&sort=Profitability24&volume=0&revenue=24h&factor%5Bexchanges%5D%5B%5D=&factor%5Bexchanges%5D%5B%5D=binance&factor%5Bexchanges%5D%5B%5D=bitfinex&factor%5Bexchanges%5D%5B%5D=bittrex&factor%5Bexchanges%5D%5B%5D=cryptobridge&factor%5Bexchanges%5D%5B%5D=cryptopia&factor%5Bexchanges%5D%5B%5D=hitbtc&factor%5Bexchanges%5D%5B%5D=poloniex&factor%5Bexchanges%5D%5B%5D=yobit&dataset=&commit=Calculate`;
  let options = {
    uri: url,
    json: true
  }
  let response = await request(options);
  let date = new Date();
  response.date = date.toLocaleString("en-US", { timezone: "EDT"});
  console.log(response.date);
  return response;
};

async function whattomineMiddleware(req, res, next) {
  req.locals = {};
  req.locals.whattomineData = await whattomineAPICall();
  next();
};

app.get("/", function(req, res) {
  res.sendFile(path.resolve("dist/crypto-control/index.html"));
});

app.get("/api/whattomine", whattomineMiddleware, function(req, res) {
  let data = req.locals.whattomineData;
  res.send({data: data});
});

app.get("/api/miners", refreshAllMiddleware, findAllMiddleware, getAllPasswordsMiddleware, function(req, res) {
  let miners = req.locals.miners;
  let passwords = req.locals.passwords;
  console.log("XXXXXXXXXXXXXXXXXXXXXXXXXXXXX END OF MINERS UPDATE XXXXXXXXXXXXXXXXXXXXXXXXXXXXX");
  res.send({miners: miners, passwords: passwords});
});

app.post("/api/miners/add", addMinerMiddleware, function(req, res) {
  res.sendStatus(200);
});

app.post("/api/miners/remove", removeMinerMiddleware, function(req, res) {
  res.sendStatus(200);
});

app.post("/api/miners/:databaseID/restart", restartMinerMiddleware, function(req, res) {
  res.sendStatus(200);
});

app.post("/api/miners/:databaseID/switchpool", switchPoolMiddleware, function(req, res) {
  res.sendStatus(200);
});

app.listen("8001", function() {
  console.log("MinerMonitor server running!");
});
