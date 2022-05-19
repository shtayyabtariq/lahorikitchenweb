import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { daterangepickerdto } from 'app/auth/models/daterangepickerdto';
import { metadata } from 'app/auth/models/metadata';
import { bankbalancedetaildto, customersalesDto, PlanScheduleDto, SalesDto, Transaction } from 'app/auth/models/plandto';
import { firebaseStoreService } from 'app/auth/service/firebasestoreservice';
import { FlatpickrOptions } from 'ng2-flatpickr';
import { ApputilsService } from '../../../auth/helpers/apputils.service';
import { CustomerDto } from '../../../auth/models/customerinfo';
import { TrialBalanceReportDto } from '../../../auth/models/plandto';

@Component({
  selector: 'app-trialbalancereport',
  templateUrl: './trialbalancereport.component.html',
  styleUrls: ['./trialbalancereport.component.scss']
})
export class TrialbalancereportComponent implements OnInit {

  public rows: any;
  public ColumnMode = ColumnMode;
  show = false;
  cust:CustomerDto[]=[];
  sales: SalesDto[] = [];
  tbrlist:TrialBalanceReportDto[]=[];
  invoices: PlanScheduleDto[] = [];


  metadata:metadata;

  
  public DateRangeOptions: FlatpickrOptions = {
    altInput: true,
    mode: 'range',
    onChange:(selectedates:any)=>{
      console.log(selectedates);
      if(selectedates.length > 1)
      {
        var drp = new daterangepickerdto();
        drp.startdate = selectedates[0];
        drp.enddate = selectedates[1];
        this.filterreport(drp);
      }
    }
  }
  showdaterange = false;
  constructor(
    public fs: firebaseStoreService,
    public route: ActivatedRoute,
    public routerser: Router,
    public ApputilsService: ApputilsService
  ) {}

  bankbalancedetail: bankbalancedetaildto[] = [];
  tempbankbalancedetail: bankbalancedetaildto[] = [];
  transactions: Transaction[] = [];
  async ngOnInit() {
    this.fs.getmetadata().valueChanges().subscribe(e=>{

      this.metadata = e;
      this.filterbanks(this.metadata.banks[0].Iban);
    });
    this.fs
      .getSales()
      .valueChanges()
      .subscribe((e) => {
        this.sales = e;
      });
      (await this.fs.getalltransactions().get().toPromise()).docs.forEach(e=>{
        this.transactions.push(e.data());
        
      });
    this.fs
      .getallinvoices()
      .valueChanges()
      .subscribe((e) => {
        this.invoices = e;
      });
    (await this.fs.getCustomer().get().toPromise()).forEach(e=>{
      this.cust.push(e.data());
      this.rangeselect("All");
    });
   
    
  }
  oncustomdateselect(val:any)
  {
    debugger;
  }
  getCustomerSales(id:string) {
    
    debugger;
    let customersales = this.sales.filter(
      (e) => e.customerid == id
    );
    let customerinvoices = this.invoices.filter(
      (e) => customersales.filter((r) => r.id == e.planid).length > 0
    );
  
    let cst:customersalesDto={
      sales: customersales,
      invoices: customerinvoices
    };
    return cst;
  
}
  async filterbanks(iban:string)
  {
    var bankamount = 0;
    let bb: bankbalancedetaildto = {
      debit: 0,
      id: "",
      apartmentname: "",
      customername: "",
      invoicename: "",
      bank: "",
      iban: "",
      paymentmethod: "",
      transactionid: "",
      invoiceid: "",
      bankamount: bankamount,
      status: "",
      transactiondate: new Date(),
      credit: 0
    };
    this.bankbalancedetail.push(bb);
    (await this.fs.gettransactionsbybank(iban)).docs.forEach((e) => {
      console.log(e.data());
      var debit = 0;
      var credit = 0;
      if(e.data().status == this.ApputilsService.TransactionSuccessfull)
      {
        bankamount += e.data().amount;
        debit = e.data().amount;
       
      }
      else{
        credit = e.data().amount;
      }      

      this.transactions.push(e.data());
      let bb: bankbalancedetaildto = {
        id: e.data().id,
        apartmentname: e.data().apartmentname,
        customername: e.data().customername,
        invoicename: e.data().invoicename,
        bank: e.data().bank,
        iban: e.data().iban,
        paymentmethod: e.data().paymentmethod,
        transactionid: e.data().transactionid,
        invoiceid: e.data().invoiceid,
        bankamount: bankamount,
        status: e.data().status,
        transactiondate: e.data().transactiondate,
        debit: debit,
        credit: credit
      };
      
      this.bankbalancedetail.push(bb);
    });
    
    
  }
  rangeselect(range: string) {
    debugger;
    this.showdaterange = false;
    this.tempbankbalancedetail = [];
    if (range == this.ApputilsService.ReportThisMonth) {
      var drp = this.ApputilsService.getMonthRange();
      this.filterreport(drp);
    } else if (range == this.ApputilsService.ReportThisYear) {
      var drp = this.ApputilsService.getYearRange();
      this.filterreport(drp);
    } else if (range == this.ApputilsService.ReportCustom) {
      this.showdaterange = true;
    } else {
      this.tbrlist = [];
    this.cust.forEach(e=>{

      var cs = this.getCustomerSales(e.id);

      let tbr:TrialBalanceReportDto={

        customername:e.name,
        bank:"",
        debit:cs.invoices.reduce((sum, current) => sum + current.amountpaid, 0),
        credit:cs.invoices.reduce((sum, current) => sum + current.amountleft, 0),
      };
      this.tbrlist.push(tbr);

    });

    
    this.metadata.banks.forEach(b=>{

      var debit = 0;
      var credit = 0;
      this.transactions.filter(e=>e.status == this.ApputilsService.TransactionSuccessfull && e.iban == b.Iban).forEach(e=>{

          debit += e.amount;

      });

      let tbr:TrialBalanceReportDto={

        customername:b.Name+"( "+b.Iban+" )",
        bank:b.Name,
        debit:debit,
        credit:0,
      };
      this.tbrlist.push(tbr);


    });
     
    
    this.show = true;
    }
  }
  filterreport(drp: daterangepickerdto) {
   
    this.show = false;
    debugger;
    this.tbrlist = [];
    this.cust.forEach(e=>{

      var cs = this.getCustomerSales(e.id);

      let tbr:TrialBalanceReportDto={

        customername:e.name,
        bank:"",
        debit:cs.invoices.filter(e=> new Date(e.invoicedueon?.seconds * 1000) >= drp.startdate && new Date(e.invoicedueon?.seconds * 1000) <= drp.enddate).reduce((sum, current) => sum + current.amountpaid, 0),
        credit:cs.invoices.filter(e=> new Date(e.invoicedueon?.seconds * 1000) >= drp.startdate && new Date(e.invoicedueon?.seconds * 1000) <= drp.enddate).reduce((sum, current) => sum + current.amountleft, 0),
      };
      this.tbrlist.push(tbr);

    });

    this.metadata.banks.forEach(b=>{

      var debit = 0;
      var credit = 0;
      this.transactions.filter(e=> new Date(e.transactiondate.seconds * 1000) >= drp.startdate && new Date(e.transactiondate.seconds * 1000) <= drp.enddate && e.status == this.ApputilsService.TransactionSuccessfull && e.iban == b.Iban).forEach(e=>{

          debit += e.amount;

      });

      let tbr:TrialBalanceReportDto={

        customername:b.Name+"( "+b.Iban+" )",
        bank:b.Name,
        debit:debit,
        credit:0,
      };
      this.tbrlist.push(tbr);


    });
     


    console.log(this.tbrlist);
      this.show = true;
   
  }

}
