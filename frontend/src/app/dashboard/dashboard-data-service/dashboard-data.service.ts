import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, Subject, timer} from 'rxjs';
import { switchMap, debounceTime, catchError, startWith } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DashboardDataService {

  constructor(private http: HttpClient) { }

  timerDelay = new BehaviorSubject(30000);
  dataTimer = this.timerDelay.pipe(switchMap((delay) => timer(0, delay)));
  minerData = new BehaviorSubject(null);
  changedRows = new BehaviorSubject([]);
  maintModeEnabled = new BehaviorSubject(false);
  autoModeEnabled = new BehaviorSubject(true);

  getData() {
    return this.http.get("http://10.0.0.100:8001/api/miners");
  }

  restartMiner(miner) {
    let url = "http://10.0.0.100:8001/api/miners/" + miner.name + "/restart";
    let options = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
      }),
    };

    let body = "";

    return this.http.post(url, body, options);
  }

  addMiner(ip, name) {
    if (ip && name) {
      let url = "http://10.0.0.100:8001/api/miners/add";
      let body = new HttpParams();
      body = body.set("ip", ip);
      body = body.set("name", name);
      let options = {
        headers: new HttpHeaders({
          'Content-Type':  'application/x-www-form-urlencoded',
        }),
        responseType: "text" as "text", // Empty response body (just status code, effectively) needs this to avoid throwing an error
      };

      this.http.post(url, body, options).subscribe();
      this.updateManually();

      return true;
    }
    return false;
  }

  removeMiner(name) {
    if (name) {
      let url = "http://10.0.0.100:8001/api/miners/remove";
      let body = new HttpParams();
      body = body.set("name", name);
      let options = {
        headers: new HttpHeaders({
          'Content-Type':  'application/x-www-form-urlencoded',
        }),
        responseType: "text" as "text", // Empty response body (just status code, effectively) needs this to avoid throwing an error
      };

      this.http.post(url, body, options).subscribe();
      this.updateManually();

      return true;
    }
    return false;
  }

  switchPool(name, poolURL, poolUser, poolPass) {
    if (name && poolURL && poolUser && poolPass) {
      let url = "http://10.0.0.100:8001/api/miners/" + name + "/switchpool";
      let body = new HttpParams();
      body = body.set("poolURL", poolURL);
      body = body.set("poolUser", poolUser);
      body = body.set("poolPass", poolPass);

      let options = {
        headers: new HttpHeaders({
          'Content-Type':  'application/x-www-form-urlencoded',
        }),
      };


      this.http.post(url, body, options).subscribe();
      return true;
    }
    return false;
  }

  switchPools(miners) {
    for (let i = 0; i < miners.length; i++) {
      let miner = miners[i];
      let name = miner.name;
      let poolURL = miner.primaryPool;
      let poolUser = miner.miningAddress;
      let poolPass = miner.password;

      this.switchPool(name, poolURL, poolUser, poolPass);
    }
  }

  }

  getMinerData() {
    this.dataTimer.subscribe({
      next: (v) => {
        if (this.autoModeEnabled.value) {
          this.getData().subscribe({
            next: (data) => {
              this.minerData.next(data);
            }
          });
        }
      }
    });

    return this.minerData.asObservable();
  }

  // Responsible for synchronizing changed rows of the dashboard table
  setChangedRows(rows) {
    this.changedRows.next(rows);
  }

  getChangedRows() {
    return this.changedRows.asObservable();
  }

  getMaintMode() {
    return this.maintModeEnabled.asObservable();
  }

  setMaintMode(bool) {
    this.maintModeEnabled.next(bool);
  }

  getAutoMode() {
    return this.autoModeEnabled.asObservable();
  }

  setAutoMode(bool) {
    this.autoModeEnabled.next(bool);
  }

  getTimerDelay() {
    return this.timerDelay.asObservable();
  }

  setTimerDelay(delay) {
    this.timerDelay.next(delay);
  }

  generateFakeData() {
    let miners = [];
    let numMiners = 10; // The number of miners to generate sample data for
    for (let i = 0; i < numMiners; i++) {
      let fakeData = {
        name: "TestN " + Math.floor(Math.random() * 100),
        ip: "10.0.0.X" + Math.floor(Math.random() * 10),
        type: "Type" + Math.floor(Math.random() * 10),
        primaryPool: "http://asdaddsada" +  + Math.floor(Math.random() * 10),
        miningAddress: "cmanmatt." + Math.floor(Math.random() * 10),
        password: "123",
        hashrateRT: Math.floor(Math.random() * 100),
        targetRT: Math.floor(Math.random() * 100),
        frequency: Math.floor(Math.random() * 100),
        chipPercent: Math.random(),
        chipTemp: Math.floor(Math.random() * 100),
        uptime: Math.floor(Math.random() * 10000000),
        restart: "N/A"
      };
      miners.push(fakeData);
    }

    return miners;
  }

}
