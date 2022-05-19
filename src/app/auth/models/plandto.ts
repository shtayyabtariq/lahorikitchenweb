import { Installments } from "../helpers/apputils.service";
import { CustomerDto } from './customerinfo';

export interface PlanDto {
    perinstallmentamount: number;
    id:string;
    client:string;
    contact:string;
    plan:number;
    installment:Installments;
    installmentamount:number;
    agreement:number;
    agreementamount:number;
    possessionamount:number;
    possession:number;
    confirmation:number;
    confirmationamount:number;
    booking:number;
    bookingamount:number;
    plancreation:any;
    planscehdule:PlanScheduleDto[];
    apartmentid:string;
    apartmentname:string;
    apartmentrate:number;
    apartmenttotalprice:number;
    apartmentarea:number;
    apartmenttype:string;
    type:string;
    createdat:any;
    updatedat:any;
    totalamount:number;
}
export interface PlanScheduleDto{
    installmentno:number;
    amount:number;
    amountpaid:number;
    amountleft:number;
    invoicedueon:any;
    invoicepaid:boolean;
    invoicepaidon:any;
    approvedby:any;
    approvalpicture:string;
    id:string;
    planid:string;
    type:string;
    createdat:any;
    updateat:any;
    orderno:number;
    
}
export class customersalesDto{
    sales:SalesDto[];
    invoices:PlanScheduleDto[];
}
export class AginReportDto{
    customername:string;
    id:string;
    amount30:number;
    amount60:number;
    amount90:number;
    amount100:number;
    total:number;
}
export class CustomersLedgerDto{
    cust:CustomerDto;
    bankbalances:bankbalancedetaildto[];

}
export class InvoicesDetailDto implements PlanScheduleDto{
    installmentno: number;
    amount: number;
    amountpaid: number;
    amountleft: number;
    invoicedueon: any;
    invoicepaid: boolean;
    invoicepaidon: any;
    approvedby: any;
    approvalpicture: string;
    id: string;
    planid: string;
    type: string;
    createdat: any;
    updateat: any;
    orderno: number;
    customer?:string;
    
}
export class TrialBalanceReportDto{
    customername:string;
    debit:number;
    credit:number;
    bank:string;
}
export interface Transaction{
    totalamount:number;
    amount:number;
    id:string;
    apartmentname:string;
    customername:string;
    invoicename:string; 
    bank:string;
    iban:string;
    paymentmethod:string;
    transactionid:string;
    invoiceid:string;
    createdat:any;
    status:string;
    updatedat:any;
    notes:string;
    transactiondate:any;
    editable:boolean;
}

export interface bankbalancedetaildto{
    debit:number;
    credit:number;
    id:string;
    apartmentname:string;
    customername:string;
    invoicename:string; 
    bank:string;
    iban:string;
    paymentmethod:string;
    transactionid:string;
    invoiceid:string;
    bankamount:number;
    status:string;
    transactiondate:any;
}
export interface SalesDto{
    id:string;
    customerid:string;
    customername:string;
    customercnic:string;
    isallpaid:boolean;
    accountcode:string;
    applicationno:string;
    perinstallmentamount: number;
    plan:number;  
    agreement:number;
    agreementamount:number;
    possessionamount:number;
    possession:number;
    confirmation:number;
    confirmationamount:number;
    booking:number;
    bookingamount:number;
    plancreation:any;
    planscehdule:PlanScheduleDto[];
    apartmentid:string;
    apartmentname:string;
    apartmentrate:number;
    apartmenttotalprice:number;
    apartmentarea:number;
    apartmenttype:string;
    type:string;
    createdat:any;
    updatedat:any;
    totalamount:number;
    totalamountpaid:number;
    totalamountleft:number;
    status:string;
    installment:Installments;
    installmentamount:number;
}