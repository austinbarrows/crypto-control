import { Component, OnInit, Input, ElementRef } from '@angular/core';
import { moveItemInArray } from '@angular/cdk/drag-drop'
import { Observable, interval, timer, BehaviorSubject } from 'rxjs';
import { DashboardDataService } from '../dashboard-data-service/dashboard-data.service';
import { MatSortModule } from '@angular/material/sort';

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
  initialMinersArray;
  defaultSort = {active: "", direction: ""};
  sortOnRecv = this.defaultSort;
  disabledMiners;
  allSelected = false;
  changedRows = [];
  selectedRows = [];
  chipPercentThreshold = .90;

  sortTableData(sort) {
    this.sortOnRecv = sort;
    console.log(sort);
    const data = this.initialMinersArray.slice();
    if (!sort.active || sort.direction === '') {
      this.miners = data;
      return;
    }


    this.miners = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'name': return compare(a.name, b.name, isAsc);
        case 'ip': return compare(a.ip, b.ip, isAsc);
        case 'type': return compare(a.type, b.type, isAsc);
        case 'pool': return compare(a.primaryPool, b.primaryPool, isAsc);
        case 'address': return compare(a.miningAddress, b.miningAddress, isAsc);
        case 'password': return compare(a.password, b.password, isAsc);
        case 'hashrate': return compare(a.hashrateRT, b.hashrateRT, isAsc);
        case 'targetHR': return compare(a.targetRT, b.targetRT, isAsc);
        case 'frequency': return compare(a.frequency, b.frequency, isAsc);
        case 'chipPercent': return compare(a.chipPercent, b.chipPercent, isAsc);
        case 'temp': return compare(a.chipTemps[0] || Number.MIN_SAFE_INTEGER, b.chipTemps[0] || Number.MIN_SAFE_INTEGER, isAsc);
        case 'uptime': return compare(a.uptime, b.uptime, isAsc);
        default: return 0;
      }
    });
  }
  /**  Copyright 2019 Google Inc. All Rights Reserved.
    Use of this source code is governed by an MIT-style license that
    can be found in the LICENSE file at http://angular.io/license */

  updateSelectedRows(miner, minerIndex, event) {
    let contains = false;
    let index = -1;

    for (let i = 0; i < this.selectedRows.length; i++) {
      if (this.selectedRows[i]._id === miner._id) {
        index = i;
        contains = true;
        break;
      }
    }

    if(event.checked) {

      this.miners[minerIndex].selected = true;
      if (contains) {
        this.selectedRows.splice(index, 1);
      }

      this.selectedRows.push(miner);
      this.dashboardDataService.setSelectedRows(this.selectedRows);
      if (this.miners.length === this.selectedRows.length) {
        this.allSelected = true;
      }
    } else {
      this.allSelected = false;
      this.miners[minerIndex].selected = false;
      if (contains) {
        this.selectedRows.splice(index, 1);
      }

      this.dashboardDataService.setSelectedRows(this.selectedRows);
    }
  }

  selectAll(event) {
    this.allSelected = true;
    for (let i = 0; i < this.miners.length; i++) {
      this.updateSelectedRows(this.miners[i], i, event)
    }
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
    console.log("Miner amount: " + miners.length)
    for (let i = 0; i < miners.length; i++) {
      let miner = miners[i];
      this.miners[i] = {};
      if ("commands" in miner) {
        if (miner.commands.stats) {
          this.miners[i] = {
            _id: miner._id,
            type: miner.commands.stats.STATS[0].Type,
            primaryPool: miner.commands.pools.POOLS[0].URL,
            miningAddress: miner.commands.pools.POOLS[0].User,
            password: data.passwords[miner._id],
            hashrateRT: miner.commands.stats.STATS[1]["GHS 5s"],
            targetRT: "N/A",
            frequency: miner.commands.stats.STATS[1].frequency,
            chipPercent: miner.commands.stats.STATS[1]["Chip%"],
            chipTemps: "N/A",
            uptime: miner.commands.stats.STATS[1].Elapsed,
            selected: false,
            restartDisabled: false,
            belowThreshold: (miner.commands.stats.STATS[1]["Chip%"] < this.chipPercentThreshold) ? true : false,
          };

          let temps = this.findTemps(miner)
          this.miners[i].chipTemps = temps;

          } else {
            this.miners[i] = {
              _id: miner._id,
              type: "",
              primaryPool: "",
              miningAddress: "",
              password: "",
              hashrateRT: "",
              targetRT: "",
              frequency: "",
              chipPercent: "",
              chipTemps: [],
              uptime: "",
              selected: false,
              restartDisabled: true,
              belowThreshold: false,
            };
          }
      } else {
        this.miners[i].restartDisabled = true
      }
      this.miners[i]._id = miner._id;
      this.miners[i].name = miner.name;
      this.miners[i].ip = miner.ip;
    }
    console.log(this.miners);
    this.initialMinersArray = this.miners;
    if (this.sortOnRecv) {
      this.sortTableData(this.sortOnRecv);
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
          this.dashboardDataService.setSelectedRows([]);
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

    this.dashboardDataService.getSelectedRows().subscribe({
      next: data => {
        this.selectedRows = data;
      }
    });

    this.dashboardDataService.getMaintMode().subscribe({
      next: data => {
        this.maintModeEnabled = data;
      }
    });

  }

}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
/**  Copyright 2019 Google Inc. All Rights Reserved.
  Use of this source code is governed by an MIT-style license that
  can be found in the LICENSE file at http://angular.io/license */
