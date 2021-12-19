import { Component, OnInit } from "@angular/core";
import { firebaseStoreService } from "../../../auth/service/firebasestoreservice";
import {
  bankbalancedetaildto,
  Transaction,
} from "../../../auth/models/plandto";
import { ColumnMode } from "@swimlane/ngx-datatable";
import { ActivatedRoute, Router } from "@angular/router";
import { ApputilsService } from "../../../auth/helpers/apputils.service";
import { daterangepickerdto } from "../../../auth/models/daterangepickerdto";
import { FlatpickrOptions } from "ng2-flatpickr";
import { metadata } from '../../../auth/models/metadata';


@Component({
  selector: "app-bankbalancereport",
  templateUrl: "./bankbalancereport.component.html",
  styleUrls: ["./bankbalancereport.component.scss"],
})
export class BankbalancereportComponent implements OnInit {
  public rows: any;
  public ColumnMode = ColumnMode;
  show = false;
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
  metadata:metadata;
  async ngOnInit() {
    this.fs.getmetadata().valueChanges().subscribe(e=>{

      this.metadata = e;
      this.filterbanks(this.metadata.banks[0].Iban);
    });
   
    
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
    var drp = this.ApputilsService.getAllRange();
    this.filterreport(drp);
  }
  oncustomdateselect(val:any)
  {
debugger;
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
      this.tempbankbalancedetail = this.bankbalancedetail;
    }
  }
  bankSelect(iban:string)
  {
    this.filterbanks(iban);
  }
  filterreport(drp: daterangepickerdto) {
    debugger;
    var firsttime = false;
    var previousbankamount = 0;
    this.tempbankbalancedetail = [];
    let previous:bankbalancedetaildto;
    for (var i = 0; i < this.bankbalancedetail.length; i++) {
      var e = this.bankbalancedetail[i];
      var tdate = new Date(e.transactiondate.seconds * 1000);
      
      if(tdate < drp.startdate)
      {
        previous = this.bankbalancedetail[i];
      }
      else
      if(+tdate >= +drp.startdate &&  +tdate <= +drp.enddate && !firsttime)
      {
        firsttime = true;
        previousbankamount = e.bankamount;
        if (i == 0) {
          previousbankamount = 0;
        } else {
          previousbankamount = this.bankbalancedetail[i - 1].bankamount;
        }
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
          bankamount: previousbankamount,
          status: "",
          transactiondate: tdate,
          credit: 0
        };
        this.tempbankbalancedetail.push(bb);
        this.tempbankbalancedetail.push(e);
      }
       else {
        var td = new Date(e.transactiondate.seconds * 1000);
        if (+td >= +drp.startdate && +td <= +drp.enddate) {
          debugger;
          this.tempbankbalancedetail.push(e);
        }
      }
    }
    if(!firsttime)
    {
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
        bankamount: previous.bankamount,
        status: "",
        transactiondate:previous.transactiondate,
        credit: 0
      };
      this.tempbankbalancedetail.push(bb);
    }
  
    this.show = true;
  }
}
