import { Installments } from "../helpers/apputils.service";

export interface PlanDto {

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

}
export interface PlanScheduleDto{
    installmentno:number;
    amount:number;
    invoicedueon:Date;
    invoicepaid:boolean;
    invoicepaidon:any;
    approvedby:any;
    approvalpicture:string;
}