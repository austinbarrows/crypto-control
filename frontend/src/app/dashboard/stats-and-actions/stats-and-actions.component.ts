import { ViewChild, ElementRef } from '@angular/core';
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
  timerDelay;
  minDelay = 1000; // Should not be 0 or lower.
  @ViewChild("addminerName") addminerName;
  @ViewChild("addminerIP") addminerIP;
  @ViewChild("removeminerName") removeminerName;

  updateSaveText() {
    let changedRows = this.changedRows;

    if(!changedRows.length) {
      this.defaultSaveText();
      this.saveButtonsDisabled = true;
    } else {
      if (changedRows.length === 1) {
        this.saveBoxText = "Changes made to miner "
      } else {
        this.saveBoxText = "Changes made to miners "
      }

      for (let i = 0; i < changedRows.length; i++) {
        this.saveBoxText += changedRows[i].name;
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

  switchChangedPools() {
    this.dashboardDataService.switchPools(this.dashboardDataService.changedRows.value);
    this.resetSaveCard();
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

  changeRefreshRate(delay) {
    if (delay > this.minDelay) {
      this.dashboardDataService.setTimerDelay(delay);
    }
  }

  addMiner(ip, name) {
    let added = this.dashboardDataService.addMiner(ip, name);
    if (added) {
      this.addminerName.nativeElement.value = "";
      this.addminerIP.nativeElement.value = "";
    }
  }

  updateManually() {
    this.dashboardDataService.updateManually();
  }

  removeMiner(name) {
    let removed = this.dashboardDataService.removeMiner(name);
    if (removed) {
      this.removeminerName.nativeElement.value = "";
    }
  }

  constructor(private dashboardDataService: DashboardDataService) { }

  ngOnInit() {
    this.dateRefresher.subscribe({
      next: data => {
        this.updateTime();
      }
    });

    this.dashboardDataService.getChangedRows().subscribe({
      next: data => {
        this.changedRows = data;
        this.updateSaveText();
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

    this.dashboardDataService.getTimerDelay().subscribe({
      next: data => {
        this.timerDelay = data;
      }
    });

  }

}
