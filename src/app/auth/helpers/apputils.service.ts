import { Injectable } from '@angular/core';

import firebase from 'firebase';


@Injectable({
  providedIn: 'root'
})
export class ApputilsService {

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

getPercentPrice(amount:number,percent ?:number)
{
  
    return ((percent/100)*amount);
  
}
PaymentMethod:string[]=[
  "Pay Order",
  "Cheque",
  "Cash",
  "IBFT",
  "Deposit"
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
Type:String[]=["1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20"];
Status:String[] = ["Open","Booked", "Hold"];

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
