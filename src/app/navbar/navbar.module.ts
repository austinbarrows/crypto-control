import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';

import { NavbarComponent } from './navbar.component';
import { NavbarCloneComponent } from './navbar-clone/navbar-clone.component';


@NgModule({
  imports: [
    CommonModule,
    MatToolbarModule
  ],
  declarations: [NavbarComponent, NavbarCloneComponent],
  exports: [NavbarComponent, NavbarCloneComponent]
})
export class NavbarModule { }
