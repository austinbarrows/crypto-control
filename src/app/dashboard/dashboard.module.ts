import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop'
import { Observable } from 'rxjs';
import { FormsModule } from'@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';


import { DashboardComponent } from './dashboard.component';
import { TableComponent } from './table/table.component';
import { TableMinerComponent } from './table/table-miner/table-miner.component';


@NgModule({
  imports: [
    CommonModule,
    DragDropModule,
    FormsModule,
    MatCardModule,
    MatDividerModule
  ],
  declarations: [
    DashboardComponent,
    TableComponent,
    TableMinerComponent
  ],
  exports: [
    DashboardComponent,
    TableComponent]
})
export class DashboardModule { }
