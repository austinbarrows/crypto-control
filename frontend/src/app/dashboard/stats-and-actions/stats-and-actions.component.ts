import { Component, OnInit, Input } from '@angular/core';
import { Observable, interval, timer, BehaviorSubject } from 'rxjs';
import { DashboardDataService } from '../dashboard-data-service/dashboard-data.service';

@Component({
  selector: 'dashboard-stats-and-actions',
  templateUrl: './stats-and-actions.component.html',
  styleUrls: ['./stats-and-actions.component.css']
})
export class StatsAndActionsComponent implements OnInit {
  time = new Date();
  dateRefresher = timer(0, 1000);
  saveButtonsDisabled = true;
  saveBoxText = "No current changes";
  changedRows;
  autoModeEnabled;
  maintModeEnabled;


  updateSaveText() {
    let changedRows = this.changedRows;

    if(!changedRows.length) {
      this.defaultSaveText();
      this.saveButtonsDisabled = true;
    } else {
      this.saveBoxText = "Changes made to miners "
      for (let i = 0; i < changedRows.length; i++) {
        this.saveBoxText += changedRows[i];
        if (!(i === changedRows.length - 1)) {
          this.saveBoxText += ", ";
        }
      }
      this.saveButtonsDisabled = false;
    }
  }

  defaultSaveText() { // The verb, to default
    this.saveBoxText = "No current changes";
  }

  resetSaveCard() {
    this.dashboardDataService.setChangedRows([]);
    //this.updateSaveText();
    this.saveButtonsDisabled = true;
  }

  selectMode(mode) {
    if (mode === "maint") { // enable maint mode
      this.dashboardDataService.setMaintMode(true);
      this.dashboardDataService.setAutoMode(false);
    } else if (mode === "auto") { // enable automatic refresh mode
      this.dashboardDataService.setMaintMode(false);
      this.dashboardDataService.setAutoMode(true);
    }
  }


  updateTime() {
    this.time = new Date();
  }

  constructor(private dashboardDataService: DashboardDataService) { }

  ngOnInit() {
    this.dateRefresher.subscribe({
      next: data => {
        this.updateTime();
      }
    })

    this.dashboardDataService.getChangedRows().subscribe({
      next: data => {
        this.changedRows = data;
        this.updateSaveText();
        console.log(data);
      }
    });

    this.dashboardDataService.getAutoMode().subscribe({
      next: data => {
        this.autoModeEnabled = data;
      }
    });

    this.dashboardDataService.getMaintMode().subscribe({
      next: data => {
        this.maintModeEnabled = data;
      }
    });

    // x
  }

}
