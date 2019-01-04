import { Component, OnInit } from '@angular/core';
import { moveItemInArray } from '@angular/cdk/drag-drop'
import { Observable, interval, timer } from 'rxjs';
import { MinerDataService } from '../miner-data-service/miner-data.service'

@Component({
  selector: 'dashboard-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {
  time = new Date();
  items = ['Zero', 'One', 'Two', 'Three'];
  dateRefresher = timer(0, 1000);
  columnsToDisplay = ["databaseName", "ipAddress", "type", "primaryPool",
                      "miningAddress", "password", "hashrateRT", "targetRT",
                      "frequency", "chipPercent", "chipTemp", "uptime",
                      "restart"];

  start = 1;
  onDrop(event) {
    moveItemInArray(this.items, event.previousIndex + this.start, event.currentIndex + this.start);
  }

  smartComma(index) {
    let arr = this.items;
    if (index !== arr.length - 1) {
      return ", ";
    } else {
      return "";
    }
  }

  updateTime() {
    this.time = new Date();
  }

  tableData;

  constructor(private minerDataService: MinerDataService){
  }

  ngOnInit() {
    this.dateRefresher.subscribe({
      next: data => this.updateTime()
    })

    this.minerDataService.getMinerData().subscribe({
      next: data => {
        this.tableData = data;
        console.log(data);
      }
    });
  }

}
