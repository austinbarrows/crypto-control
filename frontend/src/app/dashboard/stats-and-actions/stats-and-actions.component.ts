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
  saveButtonDisabled = true;
  cancelButtonDisabled = true;
  removeButtonDisabled = true;
  saveBoxText = "No current changes";
  saveBoxText2 = "No miners changed and selected";
  removeText = "No miners selected";
  changedRows = [];
  selectedRows = [];
  changedAndSelectedRows = [];
  autoModeEnabled;
  maintModeEnabled;
  timerDelay;
  minDelay = 1000; // Should not be 0 or lower.
  @ViewChild("addminerName") addminerName;
  @ViewChild("addminerIP") addminerIP;
  @ViewChild("removeminerName") removeminerName;

  updateSaveText() {
    if(!this.changedRows.length) {
      this.defaultSaveText();
      this.saveButtonDisabled = true;
      this.cancelButtonDisabled = true;
    } else {
      if (this.changedRows.length === 1) {
        this.saveBoxText = "Changes made to miner "
      } else {
        this.saveBoxText = "Changes made to miners "
      }

      for (let i = 0; i < this.changedRows.length; i++) {
        this.saveBoxText += this.changedRows[i].name;
        if (!(i === this.changedRows.length - 1)) {
          this.saveBoxText += ", ";
        }
      }
      this.cancelButtonDisabled = false;
    }
  }

  updateSaveText2() {
    if(this.changedAndSelectedRows.length === 0) {
      this.defaultSaveText2();
      this.saveButtonDisabled = true;
    } else {
      for (let i = 0; i < this.changedAndSelectedRows.length; i++) {
        if (i === 0) {
          if (this.changedAndSelectedRows.length === 1) {
            this.saveBoxText2 = "Miner changed and selected: ";
          } else {
            this.saveBoxText2 = "Miners changed and selected: ";
          }

          this.saveButtonDisabled = false;
        }

        this.saveBoxText2 += this.changedAndSelectedRows[i].name;
        if (!(i === this.changedAndSelectedRows.length - 1)) {
          this.saveBoxText2 += ", ";
        }
      }
    }
  }

  defaultSaveText() { // The verb, to default
    this.saveBoxText = "No current changes";
  }

  defaultSaveText2() {
    this.saveBoxText2 = "No miners changed and selected";
  }

  updateRemoveText() {

    if(!this.selectedRows.length) {
      this.defaultRemoveText();
      this.removeButtonDisabled = true;
    } else {
      if (this.selectedRows.length === 1) {
        this.removeText = "Miner selected: "
      } else {
        this.removeText = "Miners selected: "
      }

      for (let i = 0; i < this.selectedRows.length; i++) {
        this.removeText += this.selectedRows[i].name;
        if (!(i === this.selectedRows.length - 1)) {
          this.removeText += ", ";
        }
      }
      this.removeButtonDisabled = false;
    }
  }

  defaultRemoveText() {
    this.removeText = "No miners selected";
  }

  resetSaveCard() {
    this.dashboardDataService.setChangedRows([]);
    //this.updateSaveText();
    this.saveButtonDisabled = true;
  }

  switchPools() {
    this.dashboardDataService.switchPools(this.dashboardDataService.changedAndSelectedRows.value);
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

  removeMiners() {
    this.dashboardDataService.removeMiners();
    this.dashboardDataService.setSelectedRows([]);
  }

  constructor(private dashboardDataService: DashboardDataService) { }

  ngOnInit() {
    this.dateRefresher.subscribe({
      next: data => {
        this.updateTime();
      }
    });

    this.dashboardDataService.getSelectedRows().subscribe({
      next: data => {
        this.selectedRows = data;
        this.updateRemoveText();
      }
    });

    this.dashboardDataService.getChangedRows().subscribe({
      next: data => {
        this.changedRows = data;
        this.updateSaveText();
      }
    });

    this.dashboardDataService.getChangedAndSelectedRows().subscribe({
      next: data => {
        this.changedAndSelectedRows = data;
        this.updateSaveText2();
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
