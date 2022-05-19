import { PlanScheduleDto, SalesDto } from '../../auth/models/plandto';
import { Apartmentdto } from '../../auth/models/apartmentdto';

export class InvoiceReportDto{
    customer:string;
    amount:number;
    dueon:any;
    apartmentname:string;
    type:string;
    link:string;
    id:string;
    saleid:string;
}

export class ApartmentSoldReportDto{
    customer:string;
    rate:number;
    apartmentname:string;
    type:string;
    id:string;
    saleid:string;
    beddingtype:string;
}
export class ReportGenerator{



    getReportFromInvoices(invoices:PlanScheduleDto[],  sales:SalesDto[])
    {
        let ird:InvoiceReportDto[]=[];
        invoices.forEach(e=>{
           let sale =  sales.filter(f => f.id == e.planid)[0];
           let irddto = new InvoiceReportDto();
           irddto.amount = e.amountleft;
           irddto.customer = sale.customername;
           irddto.apartmentname = sale.apartmentname;
           irddto.type = sale.apartmenttype;
           irddto.id = e.id;
           irddto.dueon = e.invoicedueon;
           irddto.saleid = sale.id;
        
            ird.push(irddto);
        });
        return ird;
    }
    getReportFromApartments(Apartments:Apartmentdto[], Sales:SalesDto[])
    {
        debugger;
        let aparinfo:ApartmentSoldReportDto[]=[];
        Apartments.forEach(a=>{

          let sal =  Sales.filter(s=>s.status == "InProgress" && s.apartmentid == a.docid)[0]
          
          let aparinfodto = new ApartmentSoldReportDto();
          aparinfodto.apartmentname = sal.apartmentname;
          aparinfodto.customer = sal.customername;
          aparinfodto.id = sal.id;
          aparinfodto.type = sal.apartmenttype;
          aparinfodto.beddingtype = sal.type
          aparinfo.push(aparinfodto);
          


        });
        return aparinfo;
    }
}