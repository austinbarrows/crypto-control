import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StatsAndActionsComponent } from './stats-and-actions.component';

describe('StatsAndActionsComponent', () => {
  let component: StatsAndActionsComponent;
  let fixture: ComponentFixture<StatsAndActionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StatsAndActionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatsAndActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
