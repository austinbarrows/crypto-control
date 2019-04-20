import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'frequency'
})
export class FrequencyPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (value !== "") {
      return value + " Hz";
    } else {
      return "";
    }
  }

}
