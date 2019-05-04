import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TemperaturePipe } from './pipes/temperature.pipe';
import { FrequencyPipe } from './pipes/frequency.pipe';
import { UptimePipe } from './pipes/uptime.pipe'

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [TemperaturePipe, FrequencyPipe, UptimePipe],
  exports: [TemperaturePipe, FrequencyPipe, UptimePipe]
})
export class PipeModule { }
