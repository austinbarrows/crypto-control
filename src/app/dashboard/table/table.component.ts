import { Component, OnInit } from '@angular/core';
import { moveItemInArray } from '@angular/cdk/drag-drop'
import { Observable } from 'rxjs';

@Component({
  selector: 'dashboard-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {

  time = new Observable();
  items = ['Zero', 'One', 'Two', 'Three'];

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

  constructor(){ }

  ngOnInit() {
  }

}
