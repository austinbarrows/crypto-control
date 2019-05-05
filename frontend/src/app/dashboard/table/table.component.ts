import { Component, OnInit, Input, ElementRef } from '@angular/core';
import { moveItemInArray } from '@angular/cdk/drag-drop'
import { Observable, interval, timer, BehaviorSubject } from 'rxjs';
import { DashboardDataService } from '../dashboard-data-service/dashboard-data.service';

@Component({
  selector: 'dashboard-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})

export class TableComponent implements OnInit {
  maintModeEnabled;
  start = 1;
  tableData;
  miners;
  disabledMiners;
  changedRows = [];
  disabledArr = [];
  chipPercentThreshold = .90;

  /* Note A: ***OUTDATED***
     The code up to the closing A marker abuses the JavaScript type conversion
     heavily. Due to the falsy nature of an empty array, uninitialized elements
     cause all buttons to be enabled by default. When a specific falsy
     element is inverted, it becomes true due to the imperative opposite of
     a falsy element being a truthy one, thus achieving the goal of disabling
     the button linked to such element.
  */

  disable(i) {
    this.disabledArr[i] = true;
    //this.disabledArr[i] = !this.disabledArr[i]; // After revising this...how didn't I see the better (and easier) solution???
    // console.log(this.disabledArr);

  }
  /* End A */

  enable(i) {
    this.disabledArr[i] = false;
  }

  restartMiner(miner) {
    this.dashboardDataService.restartMiner(miner).subscribe();
  }

  updateChangedRows(miner, pool, user, pass) {
    miner.primaryPool = pool;
    miner.miningAddress = user;
    miner.password = pass;

    if (this.changedRows.includes(miner)) {
      this.changedRows.splice(this.changedRows.indexOf(miner), 1);
    }

    this.changedRows.push(miner);
    this.dashboardDataService.setChangedRows(this.changedRows);
  }

  setMiners(data) {
    let miners = data.miners;
    this.miners = [];
    console.log(miners.length)
    for (let i = 0; i < miners.length; i++) {
      let miner = miners[i];
      this.miners[i] = {};
      if ("commands" in miner) {
        if (miner.commands.stats) {
          this.miners[i] = {
            type: miner.commands.stats.STATS[0].Type,
            primaryPool: miner.commands.pools.POOLS[0].URL,
            miningAddress: miner.commands.pools.POOLS[0].User,
            password: data.passwords[miner.name],
            hashrateRT: miner.commands.stats.STATS[1]["GHS 5s"],
            targetRT: "N/A",
            frequency: miner.commands.stats.STATS[1].frequency,
            chipPercent: miner.commands.stats.STATS[1]["Chip%"],
            chipTemps: "N/A",
            uptime: miner.commands.stats.STATS[1].Elapsed,
            selected: true,
            belowThreshold: (miner.commands.stats.STATS[1]["Chip%"] < this.chipPercentThreshold) ? true : false,
          };

          let temps = this.findTemps(miner)
          this.miners[i].chipTemps = temps;

          this.enable(i);
          } else {
          this.disable(i);
        }
      } else {
        this.disable(i);
      }
      this.miners[i].name = miner.name;
      this.miners[i].ip = miner.ip;
    }
  }

  findTemps(miner) {
    let type = miner.commands.stats.STATS[0].Type;
    let arr = [];
    if (type === "Antminer S9") {
      arr.push(miner.commands.stats.STATS[1]["temp2_6"]);
      arr.push(miner.commands.stats.STATS[1]["temp2_7"]);
      arr.push(miner.commands.stats.STATS[1]["temp2_8"]);
    } else if (type === "Antminer S9i") {
      arr.push(miner.commands.stats.STATS[1]["temp2_6"]);
      arr.push(miner.commands.stats.STATS[1]["temp2_7"]);
      arr.push(miner.commands.stats.STATS[1]["temp2_8"]);
    } else if (type === "Antminer S11") {
      arr.push(miner.commands.stats.STATS[1]["temp3_1"]);
      arr.push(miner.commands.stats.STATS[1]["temp3_2"]);
      arr.push(miner.commands.stats.STATS[1]["temp3_3"]);
    } else if (type === "Antminer L3+") {
      arr.push(miner.commands.stats.STATS[1]["temp2_1"]);
      arr.push(miner.commands.stats.STATS[1]["temp2_2"]);
      arr.push(miner.commands.stats.STATS[1]["temp2_3"]);
      arr.push(miner.commands.stats.STATS[1]["temp2_4"]);
    }
    return arr;
  }

  drop(event) {
    moveItemInArray(this.miners, event.previousIndex, event.currentIndex);
  }

  constructor(private dashboardDataService: DashboardDataService, private elRef: ElementRef){

  }

  ngOnInit() {
    this.dashboardDataService.getMinerData().subscribe({
      next: data => {
        if (!this.maintModeEnabled) {
          this.miners = data;
          this.dashboardDataService.setChangedRows([]);
          if (data) {
            this.setMiners(data);
          }
        }
      }
    });

    this.dashboardDataService.getChangedRows().subscribe({
      next: data => {
        this.changedRows = data;
      }
    });

    this.dashboardDataService.getMaintMode().subscribe({
      next: data => {
        this.maintModeEnabled = data;
      }
    });

  }

}
