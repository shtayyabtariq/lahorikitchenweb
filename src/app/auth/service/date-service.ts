import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root',
})
export class dateservice{

  getCurrentDate()
  {
    return new Date();
  }

  getDateAfterDays(days: number)
  {
    var futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + days);
    console.log(futureDate);
    return futureDate;
  }
  getDifferenceOfDays(startdate: any, endate: any)
  {
     // To set two dates to two variables
     var date1 = new Date("06/30/2019");
     var date2 = new Date("07/30/2019");
      
     // To calculate the time difference of two dates
    var Difference_In_Time = endate.getTime() - startdate.getTime();
    // To calculate the no. of days between two dates
    var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);

    return Math.ceil( Difference_In_Days);
  }
  getmonthDiff(d1:Date, d2:Date) {
    var months;
    months = (d2.getFullYear() - d1.getFullYear()) * 12;
    months -= d1.getMonth();
    months += d2.getMonth();
    return months <= 0 ? 0 : months;
}
}