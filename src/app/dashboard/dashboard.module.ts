import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardComponent } from './dashboard.component';
import { TableComponent } from './table/table.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [DashboardComponent, TableComponent],
  exports: [DashboardComponent, TableComponent]
})
export class DashboardModule { }
