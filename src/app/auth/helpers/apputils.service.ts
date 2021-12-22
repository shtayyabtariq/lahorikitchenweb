import { Injectable } from '@angular/core';

import firebase from 'firebase';
import { daterangepickerdto } from '../models/daterangepickerdto';


@Injectable({
  providedIn: 'root'
})
export class ApputilsService {

  All="All";
  ThisMonth = "This Month";
  ThisYear = "This Year";
  ThisMonthDue = "This Month Due";
  ThisMonthUpComing = "This Month UpComing";
  Due = "Due";
  Paid = "Paid";
  ThisMonthPaid = "This Month Paid";

   monthtly : Installments={
    text: 'Monthly',
    months: 1
  };
  quaterly : Installments={
    text: 'Quaterly',
    months: 3
  };
  biannually : Installments={
    text: 'BiAnually',
    months: 6
  };
  anually : Installments={
    text: 'Anually',
    months: 12
  };

  AdminRole = "Admin";
  EmployeeRole = "Employee";
  ManagerRole = "Manager";
  Roles = [
    this.AdminRole,
    this.EmployeeRole,
    this.ManagerRole
  ]

AppName = "Management Information System";
Apartment4BedDuplex = "4 Bed Duplex ";
Apartment5BedDuplex = "5 Bed Duplex ";
Penthouse = "Penthouse ";

TransactionSuccessfull = "Successfull";
TransactionInvalid = "Invalid";
getServerTimestamp() { return firebase.firestore.FieldValue.serverTimestamp(); }

getDateAfterMonths(dt:Date,month:number)
{
   dt.setMonth(dt.getMonth()+month);
   return dt;

}
getTotalPrice(grossarea:number,rate:number,discount ?:number)
{
  if(discount != null)
  {
    return (grossarea *(((100-discount)/100)*rate));
  }
  else{
    return (grossarea*rate);
  }
}

getDiscountedTotalPrice(price:number,discount ?:number)
{
  if(discount != null)
  {
    return (((100-discount)/100)*price);
  }
  else{
    return price;
  }
}

getMonthRange()
{
    let drp = new daterangepickerdto();
    var date = new Date();
    date.setDate(1);
    drp.startdate = date;
    date = new Date();
    date.setMonth(date.getMonth()+1);
    date.setDate(0);
    drp.enddate = date;
    drp.option = "Month";
    return drp;
}
getAllRange()
{
    let drp = new daterangepickerdto();
    var date = new Date(2017,1,1);
    date.setDate(1);
    drp.startdate = date;
    date = new Date();
    date.setMonth(date.getMonth()+500);
    date.setDate(0);
    drp.enddate = date;
    drp.option = "All";
    return drp;
}
getYearRange()
{
  debugger;
    let drp = new daterangepickerdto();
    var date = new Date();
    date.setDate(1);
    date.setMonth(0);
    drp.startdate = date;
    date = new Date(date.getFullYear(),11,31);
    drp.enddate = date;
    return drp;
}
groupBy<T, K>(list: T[], getKey: (item: T) => K) {
  const map = new Map<K, T[]>();
  list.forEach((item) => {
      const key = getKey(item);
      const collection = map.get(key);
      if (!collection) {
          map.set(key, [item]);
      } else {
          collection.push(item);
      }
  });
  return Array.from(map.values());
}
getPercentPrice(amount:number,percent ?:number)
{
  
    return Math.round( ((percent/100)*amount));
  
}
PaymentMethod:string[]=[
  "Pay Order",
  "Cheque",
  "Cash",
  "IBFT",
  "Deposit"
];
ReportThisMonth = "This Month";
ReportThisYear = "This Year";
ReportCustom = "Custom";
ReportAll ="All"
ReportingTime:string[]=[
  this.ReportAll,
  this.ReportThisMonth,
  this.ReportThisYear,
  this.ReportCustom
];

Years:number[]=[
  1,2,3,4,5,6,7,8,9,10
]
TransactionStatus:String[]=[
  this.TransactionSuccessfull,
  this.TransactionInvalid
];
InstallmentPlan:Installments[]=[
   this.monthtly,
   this.quaterly,
   this.biannually,
   this.anually
]

ApartmentType:String[]=[
  "1 Bed Room Apartment ",
  "2 Bed Room Apartment ",
  "3 Bed Room Apartment ",
  "4 Bed Room Apartment ",
  this.Apartment4BedDuplex,
  this.Apartment5BedDuplex,
  this.Penthouse
];

Aging30 = "1-30";
Aging60 = "31-60";
Aging90="61-90";

AgingFilters:string[]=[
this.Aging30,
this.Aging60,
this.Aging90
];
CustomerAgingReport = "Customer Aging Report";
CustomerLedgerReport = "Customer Ledger Report";
CustomerOutStandingInvoices = "Customer Outstanding Invoices";
CustomerOverDueInvoices = "Customer OverDue Invoices";
CustomerOpenBalanceReports = "Customer Open Balance Reports";
CustomerAccountReceivableReports ="Customer Account Receivabel Reports";

CustomerReports:String[]=[
  this.CustomerAgingReport,
  this.CustomerLedgerReport,
  this.CustomerOpenBalanceReports,
  this.CustomerOverDueInvoices,
  this.CustomerOutStandingInvoices,
  this.CustomerAccountReceivableReports
];
Type:String[]=["1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20"];
PossesionStatus="Completed";
Status:String[] = ["Open","Booked", "Hold",this.PossesionStatus];
HoldStatus = "Hold";
BookedStatus = "Booked";
OpenStatus = "Open";

constructor() { }

AppVersion = "1.0.0";
CompanyWebSiteName() { return this.Company.WebSiteName; }
WebsiteVersion() { return this.AppVersion; }

  Company = {
    "Name": "Trading Academy",
    "WebSiteName": "Trading Academy",
    "WebSiteAddress": "www.tradingacademy.us",
    "Email": "info@tradingacademy.us",
    "PolicyEmail": "policy@tradingacademy.us",
    "Phone": "(804) 256-8100",
    "SMS": "8042568100",
    "FullAddress": "145 Fleet Street, STE 142, National Harbor, MD 20745",
    "Address1": "145 Fleet Street, STE 142",
    "Address2": "National Harbor, MD 20745",
  }
}
export interface Installments{
  text:string;
  months:number;
  
}
export class InvoiceType{
  static Posession:string = "Posession";
  static Agreement:string = "Agreement";
  static Installment:string = "Installment";
  static Confirmation:string = "Confirmation";
  static Booking:string = "Booking";
}
export class SaleStatus{
  static InProgress:string = "InProgress";
  static Completed:string="Completed";
  static Closed:string = "Closed";

}
export class InvoiceStatus{
  static UnPaid:string = "UnPaid";
  static Paid:string="Paid";
  static Pending:string = "Pending";
}
export class FilterStatus{
  
}
