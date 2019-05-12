/*
 * node-scp
 * <cam@onswipe.com>
 * modified by austin-barrows to support pscp and promises instead
 */
var exec = require("child_process").exec;

var pscp = module.exports = {};

/*
 * Transfer a file to a remote host
 */
pscp.put = function (options) {
  return new Promise((resolve, reject) => {
    if (options.ignoreHostKey) {
      options.acceptHostKey = false;
    }
    var command = [
      (options.acceptHostKey ? "echo y |" : ""), //WARNING: Using this parameter puts you at risk of MITM attacks especially over the exposed web, best used on internal networks
      (options.ignoreHostKey ? "echo n |" : ""), //WARNING: Using this parameter puts you at risk of MITM attacks especially over the exposed web, best used on internal networks
      "pscp",
      "-r",
      "-noagent",
      (options.forceProtocol ? "-" + options.forceProtocol : "-scp"),
      "-P",
      options.port,
      "-pw",
      options.pass,
      options.localPath,
      options.user + "@" + options.host + ":" + options.remotePath,
    ];
    exec(command.join(" "), function (err, stdout, stderr) {
      if (!err) {
        resolve("File transfer complete");
      } else {
        reject(new Error(err));
      }
    });
  });
}

/*
 * Grab a file from a remote host
 */
pscp.get = function (options) {
  return new Promise((resolve, reject) => {
    if (options.ignoreHostKey) {
      options.acceptHostKey = false;
    }
    var command = [
      (options.acceptHostKey ? "echo y |" : ""), //WARNING: Using this parameter puts you at risk of MITM attacks especially over the exposed web, best used on internal networks
      (options.ignoreHostKey ? "echo n |" : ""), //WARNING: Using this parameter puts you at risk of MITM attacks especially over the exposed web, best used on internal networks
      "pscp",
      "-r",
      "-noagent",
      (options.forceProtocol ? "-" + options.forceProtocol : "-scp"),
      "-P",
      options.port,
      "-pw",
      options.pass,
      options.user + "@" + options.host + ":" + options.remotePath,
      options.localPath
    ];
    exec(command.join(" "), function (err, stdout, stderr) {
      if (!err) {
        resolve("File transfer complete");
      } else {
        reject(new Error(err));
      }
    });
  });
}
