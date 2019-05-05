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

  /* Note A: ***OUTDATED***
     The code up to the closing A marker abuses the JavaScript type conversion
     heavily. Due to the falsy nature of an empty array, uninitialized elements
     cause all buttons to be enabled by default. When a specific falsy
     element is inverted, it becomes true due to the imperative opposite of
     a falsy element being a truthy one, thus achieving the goal of disabling
     the button linked to such element.
  */
  disabledArr = [];

  disable(i) {

    this.disabledArr[i] = !this.disabledArr[i];
    // console.log(this.disabledArr);

  }
  /* End A */

  disabledMiners;
  changedRows = [];
  updateChangedRows(miner) {
    console.log(miner);
    if (!this.changedRows.includes(miner.name)) {
      this.changedRows.push(miner.name);
      this.dashboardDataService.setChangedRows(this.changedRows);
    }
  }

  setMiners(data) {
    let miners = data.miners;
    this.miners = [];
    console.log(miners.length)
    for (let i = 0; i < miners.length; i++) {
      let miner = miners[i];
      this.miners[i] = {};
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
          chipTemp: "N/A",
          uptime: miner.commands.stats.STATS[1].Elapsed,
          selected: true,
        };
      }
      this.miners[i].name = miner.name;
      this.miners[i].ip = miner.ip;
    }
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
        }
        //this.setMiners(data);
        //console.log(data);
      }
    });

    this.dashboardDataService.getChangedRows().subscribe({
      next: data => {
        this.changedRows = data;
        //this.setMiners(data);
        console.log(data);
      }
    });

    this.dashboardDataService.getMaintMode().subscribe({
      next: data => {
        this.maintModeEnabled = data;
        console.log(data);
      }
    });

    // x
    console.log(this.disabledArr);
  }

}
