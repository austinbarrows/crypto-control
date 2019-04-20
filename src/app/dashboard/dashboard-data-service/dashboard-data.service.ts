import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, timer } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DashboardDataService {

  constructor(private http: HttpClient) { }

  // Responsible for getting data about miners
  dataTimer = timer(0, 2000);
  generateFakeData() {
    let data = [
      {
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
      },
      {
        name: "TestN " + Math.floor(Math.random() * 100),
        ip: "10.0.0.X" + Math.floor(Math.random() * 10),
        type: "Type" + Math.floor(Math.random() * 10),
        primaryPool: "http://asdaddsada" + Math.floor(Math.random() * 10),
        miningAddress: "cmanmatt." + Math.floor(Math.random() * 10),
        password: "123",
        hashrateRT: Math.floor(Math.random() * 100),
        targetRT: Math.floor(Math.random() * 100),
        frequency: Math.floor(Math.random() * 100),
        chipPercent: Math.random(),
        chipTemp: Math.floor(Math.random() * 100),
        uptime: Math.floor(Math.random() * 10000000),
        restart: "N/A"
      },
      {
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
      },
      {
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
      },
      {
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
      },
      {
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
      },
      {
        name: "TestN " + Math.floor(Math.random() * 100),
        ip: "10.0.0.X" + Math.floor(Math.random() * 10),
        type: "Type" + Math.floor(Math.random() * 10),
        primaryPool: "http://asdaddsada" + Math.floor(Math.random() * 10),
        miningAddress: "cmanmatt." + Math.floor(Math.random() * 10),
        password: "123",
        hashrateRT: Math.floor(Math.random() * 100),
        targetRT: Math.floor(Math.random() * 100),
        frequency: Math.floor(Math.random() * 100),
        chipPercent: Math.random(),
        chipTemp: Math.floor(Math.random() * 100),
        uptime: Math.floor(Math.random() * 10000000),
        restart: "N/A"
      },
      {
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
      },
      {
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
      },
      {
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
      },
      {
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
      },
      {
        name: "TestN " + Math.floor(Math.random() * 100),
        ip: "10.0.0.X" + Math.floor(Math.random() * 10),
        type: "Type" + Math.floor(Math.random() * 10),
        primaryPool: "http://asdaddsada" + Math.floor(Math.random() * 10),
        miningAddress: "cmanmatt." + Math.floor(Math.random() * 10),
        password: "123",
        hashrateRT: Math.floor(Math.random() * 100),
        targetRT: Math.floor(Math.random() * 100),
        frequency: Math.floor(Math.random() * 100),
        chipPercent: Math.random(),
        chipTemp: Math.floor(Math.random() * 100),
        uptime: Math.floor(Math.random() * 10000000),
        restart: "N/A"
      },
      {
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
      },
      {
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
      },
      {
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
      },
      {
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
      },
      {
        name: "TestN " + Math.floor(Math.random() * 100),
        ip: "10.0.0.X" + Math.floor(Math.random() * 10),
        type: "Type" + Math.floor(Math.random() * 10),
        primaryPool: "http://asdaddsada" + Math.floor(Math.random() * 10),
        miningAddress: "cmanmatt." + Math.floor(Math.random() * 10),
        password: "123",
        hashrateRT: Math.floor(Math.random() * 100),
        targetRT: Math.floor(Math.random() * 100),
        frequency: Math.floor(Math.random() * 100),
        chipPercent: Math.random(),
        chipTemp: Math.floor(Math.random() * 100),
        uptime: Math.floor(Math.random() * 10000000),
        restart: "N/A"
      },
      {
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
      },
      {
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
      },
      {
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
      },
      {
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
      },
      {
        name: "TestN " + Math.floor(Math.random() * 100),
        ip: "10.0.0.X" + Math.floor(Math.random() * 10),
        type: "Type" + Math.floor(Math.random() * 10),
        primaryPool: "http://asdaddsada" + Math.floor(Math.random() * 10),
        miningAddress: "cmanmatt." + Math.floor(Math.random() * 10),
        password: "123",
        hashrateRT: Math.floor(Math.random() * 100),
        targetRT: Math.floor(Math.random() * 100),
        frequency: Math.floor(Math.random() * 100),
        chipPercent: Math.random(),
        chipTemp: Math.floor(Math.random() * 100),
        uptime: Math.floor(Math.random() * 10000000),
        restart: "N/A"
      },
      {
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
      },
      {
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
      },
      {
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
      },
    ];
    return data;
  }

  //data = this.getData();
  getData() {
    return this.http.get("http://10.0.0.100:8001/miners");
  }

  minerData = new BehaviorSubject(this.generateFakeData()); // **For later: make minerData the central source of data, only get new results from API to minerData
  getMinerData() {
    this.dataTimer.subscribe({
      next: (v) => {
        this.minerData.next(this.generateFakeData())
        //this.minerData = this.getData();
      }
    });

    return this.minerData.asObservable();
  }




  // Responsible for synchronizing changed rows of the dashboard table
  changedRows = new BehaviorSubject([]);
  setChangedRows(rows) {
    this.changedRows.next(rows);
  }

  getChangedRows() {
    return this.changedRows.asObservable();
  }




  // Responsible for synchronizing variables (so far, only the dashboard modes)
  maintModeEnabled = new BehaviorSubject(false);
  autoModeEnabled = new BehaviorSubject(true);

  getMaintMode() {
    return this.maintModeEnabled.asObservable();
  }
  getAutoMode() {
    return this.autoModeEnabled.asObservable();
  }

  setMaintMode(bool) {
    this.maintModeEnabled.next(bool);
  }
  setAutoMode(bool) {
    this.autoModeEnabled.next(bool);
  }
}