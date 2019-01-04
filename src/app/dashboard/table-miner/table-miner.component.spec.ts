import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableMinerComponent } from './table-miner.component';

describe('TableMinerComponent', () => {
  let component: TableMinerComponent;
  let fixture: ComponentFixture<TableMinerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TableMinerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableMinerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
