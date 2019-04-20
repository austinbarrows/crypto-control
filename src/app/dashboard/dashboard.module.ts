import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DragDropModule } from '@angular/cdk/drag-drop'
import { Observable } from 'rxjs';
import { FormsModule } from'@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatIconModule } from '@angular/material/icon';

import { PipeModule } from '../pipe/pipe.module';

import { DashboardComponent } from './dashboard.component';
import { TableComponent } from './table/table.component';
import { StatsAndActionsComponent } from './stats-and-actions/stats-and-actions.component';

@NgModule({
  imports: [
    CommonModule,
    DragDropModule,
    FormsModule,
    MatCardModule,
    MatDividerModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    PipeModule,
    MatButtonModule,
    MatToolbarModule,
    MatCheckboxModule,
    FlexLayoutModule,
    MatIconModule
  ],
  declarations: [
    DashboardComponent,
    TableComponent,
    StatsAndActionsComponent
  ],
  exports: [
    DashboardComponent,
    TableComponent]
})
export class DashboardModule { }
