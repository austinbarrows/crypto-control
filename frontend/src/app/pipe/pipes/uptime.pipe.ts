import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'uptime'
})
export class UptimePipe implements PipeTransform {

  transform(seconds): any {
    if (seconds === undefined || seconds === "") {
      return "";
    } else if (seconds === 0) {
      return "0s";
    }
    let times = [];
    let timeString;
    let years = Math.floor(seconds / (60 * 60 * 24 * 365));
    seconds = seconds - (years * 60 * 60 * 24 * 365);
    times[5] = years;

    let weeks = Math.floor(seconds / (60 * 60 * 24 * 7));
    seconds = seconds - (weeks * 60 * 60 * 24 * 7);
    times[4] = weeks;

    let days = Math.floor(seconds / (60 * 60 * 24));
    seconds = seconds - (days * 60 * 60 * 24);
    times[3] = days;

    let hours = Math.floor(seconds / (60 * 60));
    seconds = seconds - (hours * 60 * 60);
    times[2] = hours;

    let minutes = Math.floor(seconds / 60);
    seconds = seconds - (minutes * 60);
    times[1] = minutes;

    times[0] = seconds;

    if (times[5] > 0) {
      timeString = times[5] + "y " + times[4] + "w " + times[3] + "d " + times[2] + "h " + times[1] + "m " + times[0] + "s";
    } else if (times[4] > 0){
      timeString = times[4] + "w " + times[3] + "d " + times[2] + "h " + times[1] + "m " + times[0] + "s";
    } else if (times[3] > 0) {
      timeString = times[3] + "d " + times[2] + "h " + times[1] + "m " + times[0] + "s";
    } else if (times[2] > 0) {
      timeString = times[2] + "h " + times[1] + "m " + times[0] + "s";
    } else if (times[1] > 0) {
      timeString = times[1] + "m " + times[0] + "s";
    } else {
      timeString = times[0] + "s";
    }

    return timeString;

  }

}
