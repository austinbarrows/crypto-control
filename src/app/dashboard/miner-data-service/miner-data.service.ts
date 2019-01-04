import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, timer } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class MinerDataService {

  constructor() { }

  dataTimer = timer(0, 1000);

  generateFakeData() {
    let dataOld = [
      "DB Name: " + Math.random(),
      "DB Name: " + Math.random(),
      "DB Name: " + Math.random(),
      "DB Name: " + Math.random(),
      "DB Name: " + Math.random(),
      "DB Name: " + Math.random(),
      "DB Name: " + Math.random(),
      "DB Name: " + Math.random(),
      "DB Name: " + Math.random(),
      "DB Name: " + Math.random(),
      "DB Name: " + Math.random(),
      "DB Name: " + Math.random(),
      "DB Name: " + Math.random()
    ];

    let data = [
      {
        databaseName: "TestN " + Math.floor(Math.random() * 10),
        ipAddress: "10.0.0.X" + Math.floor(Math.random() * 10),
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
        databaseName: "TestN " + Math.floor(Math.random() * 10),
        ipAddress: "10.0.0.X" + Math.floor(Math.random() * 10),
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
        databaseName: "TestN " + Math.floor(Math.random() * 10),
        ipAddress: "10.0.0.X" + Math.floor(Math.random() * 10),
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
        databaseName: "TestN " + Math.floor(Math.random() * 10),
        ipAddress: "10.0.0.X" + Math.floor(Math.random() * 10),
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
        databaseName: "TestN " + Math.floor(Math.random() * 10),
        ipAddress: "10.0.0.X" + Math.floor(Math.random() * 10),
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
    ]
    return data;
  }
  data = new BehaviorSubject(this.generateFakeData());


  getMinerData() {
    this.dataTimer.subscribe({
      next: (v) => {
        this.data.next(this.generateFakeData())
      }
    });

    return this.data.asObservable();
  }
}
