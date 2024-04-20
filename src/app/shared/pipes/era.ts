import { Pipe, PipeTransform } from '@angular/core';
import { Language } from '../models/shared-model';

@Pipe({
  name: 'era'
})
export class EraPipe implements PipeTransform {

  transform(date: string, language: Language) {
    // console.log(date);
    // console.log(typeof date);
    // console.log(new Date(date));

    if (language === 'TH') {
      date = this.convertToThaiBuddhistDate(date)
    }

    // console.log(language);

    return date
  }

  /**
   * Function to convert Gregorian date to Thai Buddhist date.
   * @param gregorianDate
   * @returns Date string
   */
  private convertToThaiBuddhistDate(gregorianDate: string) {
    // Parse the input date string
    const dateParts = gregorianDate.split('-');
    const gregorianYear = Number(dateParts[2]);

    // Thai Buddhist calendar offset
    const thaiBuddhistCalendarOffset = 543;

    // Convert the year to Thai Buddhist calendar
    const thaiBuddhistYear = gregorianYear + thaiBuddhistCalendarOffset;

    // Format the result
    const thaiBuddhistDate = `${dateParts[0]}-${dateParts[1]}-${thaiBuddhistYear}`;

    return thaiBuddhistDate;
  }
}
