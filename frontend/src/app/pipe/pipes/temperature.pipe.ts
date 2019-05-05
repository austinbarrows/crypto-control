import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'temperature'
})
export class TemperaturePipe implements PipeTransform {

  transform(value: any, system: string): any {
    if (value === undefined) {
      return "";
    }

    let arr = value;
    value = "";
    for (let i = 0; i < arr.length; i++) {
      if (i != arr.length - 1) {
        value += arr[i] + ", ";
      } else {
        value += arr[i];
      }
    }


    let modifiedVal;
    switch(system) {
      case "Celsius":
        modifiedVal = value + " °C";
        break;
      case "Fahrenheit":
        modifiedVal = value + " °F";
        break;
      case "Kelvin":
        modifiedVal = value + " K";
        break;
      case "Rankine":
        modifiedVal = value + " °R"
        break;
    }
    return modifiedVal;
  }

}
