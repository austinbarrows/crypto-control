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
