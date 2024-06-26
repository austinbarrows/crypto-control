import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, Subject, timer} from 'rxjs';
import { switchMap, debounceTime, catchError, startWith } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DashboardDataService {

  constructor(private http: HttpClient) { }

  timerDelay = new BehaviorSubject(10000);
  dataTimer = this.timerDelay.pipe(switchMap((delay) => timer(0, delay)));
  minerData = new BehaviorSubject(null);
  changedRows = new BehaviorSubject([]);
  selectedRows = new BehaviorSubject([]);
  changedAndSelectedRows = new BehaviorSubject([]);
  maintModeEnabled = new BehaviorSubject(false);
  autoModeEnabled = new BehaviorSubject(true);
  serverIp = "http://10.0.0.100:8001";

  getData(refreshAll) {
    let url = this.serverIp + "/api/miners";
    let options = {
      headers: new HttpHeaders({
        'Content-Type':  'application/x-www-form-urlencoded',
      }),
    };
    let body = new HttpParams();
    body = body.set("refreshAll", refreshAll);

    return this.http.post(url, body, options);
  }

  restartMiner(miner) {
    let url = this.serverIp + "/api/miners/" + miner._id + "/restart";
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
      let url = this.serverIp + "/api/miners/add";
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

  removeMiners() {
    let miners: any = this.selectedRows.value;
    for (let i = 0; i < miners.length; i++) {
      let url = this.serverIp + "/api/miners/remove";
      let body = new HttpParams();
      body = body.set("id", miners[i]._id);
      let options = {
        headers: new HttpHeaders({
          'Content-Type':  'application/x-www-form-urlencoded',
        }),
        responseType: "text" as "text", // Empty response body (just status code, effectively) needs this to avoid throwing an error
      };

      this.http.post(url, body, options).subscribe();
    }
    this.setSelectedRows([]);
    this.updateManually();
  }

  switchPool(id, poolURL, poolUser, poolPass) {
    if (id && poolURL && poolUser && poolPass) {
      let url = this.serverIp + "/api/miners/" + id + "/switchpool";
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
      let id = miner._id;
      let poolURL = miner.primaryPool;
      let poolUser = miner.miningAddress;
      let poolPass = miner.password;

      this.switchPool(id, poolURL, poolUser, poolPass);
    }
  }

  updateManually() {
    this.getData(true).subscribe({next: (data) => {
        this.minerData.next(data);
      }
    });
  }

  getMinerData() {
    this.dataTimer.subscribe({
      next: (v) => {
        if (this.autoModeEnabled.value) {
          this.getData(false).subscribe({
            next: (data) => {
              this.minerData.next(data);
            }
          });
        }
      }
    });

    return this.minerData.asObservable();
  }

  computeChangedAndSelectedRows() {
    let changedAndSelected = [];
    let changedRows: any = this.changedRows.value;
    let selectedRows: any = this.selectedRows.value;

    for (let i = 0; i < changedRows.length; i++) { // Testing which changedRows are also selected
      for (let j = 0; j < selectedRows.length; j++) {
        if (changedRows[i]._id === selectedRows[j]._id) {
          changedAndSelected.push(changedRows[i]);
        }
      }
    }

    this.setChangedAndSelectedRows(changedAndSelected);
  }

  // Responsible for synchronizing changed rows of the dashboard table
  setChangedRows(rows) {
    this.changedRows.next(rows);
    this.computeChangedAndSelectedRows();
  }

  getChangedRows() {
    return this.changedRows.asObservable();
  }

  setSelectedRows(rows) {
    this.selectedRows.next(rows);
    this.computeChangedAndSelectedRows();
  }

  getSelectedRows() {
    return this.selectedRows.asObservable();
  }

  getChangedAndSelectedRows() {
    return this.changedAndSelectedRows.asObservable();
  }

  setChangedAndSelectedRows(rows) {
    this.changedAndSelectedRows.next(rows);
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
