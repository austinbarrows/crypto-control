import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarCloneComponent } from './navbar-clone.component';

describe('NavbarCloneComponent', () => {
  let component: NavbarCloneComponent;
  let fixture: ComponentFixture<NavbarCloneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NavbarCloneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarCloneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
