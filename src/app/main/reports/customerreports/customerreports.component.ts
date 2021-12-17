import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { CoreSidebarService } from "@core/components/core-sidebar/core-sidebar.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ColumnMode, DatatableComponent } from "@swimlane/ngx-datatable";
import { RouterHelper } from "app/auth/helpers/router-helper";
import { CustomerDto } from "app/auth/models/customerinfo";
import { firebaseStoreService } from "app/auth/service/firebasestoreservice";
import { NotificationService } from "app/auth/service/notification.service";
import { ApputilsService } from "../../../auth/helpers/apputils.service";
import {
  SalesDto,
  PlanScheduleDto,
  Transaction,
  bankbalancedetaildto,
} from "../../../auth/models/plandto";
import { Invoicedto } from "../../../auth/models/apartmentdto";
import { debug } from "console";
import { stat } from "fs";
import { daterangepickerdto } from "app/auth/models/daterangepickerdto";
import { FilteroptionselectComponent } from "app/main/filteroptionselect/filteroptionselect.component";
import { doesNotReject } from "assert";

@Component({
  selector: "app-customerreports",
  templateUrl: "./customerreports.component.html",
  styleUrls: ["./customerreports.component.scss"],
})
export class CustomerreportsComponent implements OnInit {
  public rows: any;
  public ColumnMode = ColumnMode;
  public currentCustomer: CustomerDto;
  filters: String[] = [];
  @ViewChild(DatatableComponent) table: DatatableComponent;
  cust: CustomerDto[] = [];
  sales: SalesDto[] = [];
  customersales: SalesDto[] = [];
  invoices: PlanScheduleDto[] = [];
  customerinvoices: PlanScheduleDto[] = [];
  transactions: Transaction[] = [];
  customertransaction: Transaction[] = [];
  bankbalancedetail: bankbalancedetaildto[] = [];
  tempbankbalancedetail: bankbalancedetaildto[] = [];
  overdueinvoices: PlanScheduleDto[] = [];
  aginginvoices: PlanScheduleDto[] = [];
  upcominginvoices: PlanScheduleDto[] = [];
  drp: daterangepickerdto;
  selectedagingfilter:string=this.ApputilsService.Aging30;
  report: number = 0;
  filtertext:string="Choose Filter Options";
  
  constructor(
    public modal: NgbModal,
    public modalservice: NgbModal,
    public route: ActivatedRoute,
    public routerser: Router,
    public ApputilsService: ApputilsService,
    public router: RouterHelper,

    public nts: NotificationService,
    private _coreSidebarService: CoreSidebarService,
    public fs: firebaseStoreService
  ) {}

  ngOnInit() {
    this.fs
      .getCustomer()
      .valueChanges()
      .subscribe((e) => {
        this.cust = e;
      });
    this.fs
      .getSales()
      .valueChanges()
      .subscribe((e) => {
        this.sales = e;
      });
    this.fs
      .getallinvoices()
      .valueChanges()
      .subscribe((e) => {
        this.invoices = e;
      });
    this.fs
      .getalltransactions()
      .valueChanges()
      .subscribe((e) => {
        this.transactions = e;
      });
      
      let dr:daterangepickerdto={
        startdate: new Date(),
        enddate: new Date(),
        option:"All"
        
      };
      this.drp = dr;

      
      
  }
  onCustomerSelect($event) {
    this.currentCustomer = $event;
    this.generateparticularreport();
  }
  generateparticularreport() {
    switch (this.report) {
      case 0:
        this.agingfilter(this.selectedagingfilter);
        break;
      case 1:
        this.overdueinvoicesreport(this.drp);
        break;
      case 2:
        this.customledgerreport();
        break;
      case 3:
        this.upcominginvoicesreport(this.drp.startdate, this.drp.enddate);
        break;
      case 4:
        break;
    }
  }
  onreportselect(val: any) {
    debugger;
    switch (val) {
      case this.ApputilsService.CustomerAgingReport:
        this.report = 0;

        break;
      case this.ApputilsService.CustomerOverDueInvoices:
        this.report = 1;

        break;
      case this.ApputilsService.CustomerLedgerReport:
        this.report = 2;

        break;
      case this.ApputilsService.CustomerOutStandingInvoices:
        this.report = 3;

        break;
    }
    this.generateparticularreport();
  }
  generatereports() {
    var monthRange = this.ApputilsService.getMonthRange();
    this.filterCustomerSales();
    this.agingreport(0);
    this.customledgerreport();
    this.overdueinvoicesreport(this.drp);
    this.upcominginvoicesreport(monthRange.startdate, monthRange.enddate);
  }
  filterCustomerSales() {
    this.customersales = this.sales.filter(
      (e) => e.customerid == this.currentCustomer.id
    );
    this.customerinvoices = this.invoices.filter(
      (e) => this.customersales.filter((r) => r.id == e.planid).length > 0
    );
  }
  agingreport(startdate: any) {
    debugger;
    this.filterCustomerSales();
    var dt = new Date();
    dt.setDate(dt.getDate() - startdate);
    var d30 = new Date();
    d30.setDate(d30.getDate() - (startdate + 31));
    this.aginginvoices = this.customerinvoices.filter(
      (e) =>
        new Date(e.invoicedueon?.seconds * 1000) < dt &&
        new Date(e.invoicedueon?.seconds * 1000) >= d30
    );
  }
  filter() {
    this.modalservice
      .open(FilteroptionselectComponent)
      .closed.subscribe((e) => {
        var drp = e as daterangepickerdto;
        console.log(drp);
        this.drp = drp;
        this.filtertext = this?.drp?.option;
        this.generateparticularreport();
      });
  }
  overdueinvoicesreport(drp:daterangepickerdto) {
    var dt = new Date();
    drp.enddate = dt;
    this.overdueinvoices = this.customerinvoices.filter(
      (e) => +new Date(e.invoicedueon?.seconds * 1000) >= +drp.startdate
      && ( drp.enddate == undefined || +new Date(e.invoicedueon?.seconds * 1000) <= +drp.enddate)
    );
  }
  agingfilter(filter: string) {
    if (filter == this.ApputilsService.Aging30) {
      this.agingreport(0);
    } else if (filter == this.ApputilsService.Aging60) {
      this.agingreport(31);
    } else {
      this.agingreport(61);
    }
  }
  customledgerreport() {
    this.bankbalancedetail=[];
    this.filterCustomerSales();
    this.customertransaction = this.transactions.filter(
      (e) => this.customerinvoices.filter((i) => i.id == e.invoiceid).length > 0
    );
    var bankamount = 0;
    this.customertransaction = this.customertransaction.sort((a, b) => {
      return a.transactiondate > b.transactiondate ? 1 : -1;
    });
    this.customertransaction.forEach((e) => {
      var debit = 0;
      var credit = 0;

      if (e.status == this.ApputilsService.TransactionSuccessfull) {
        bankamount += e.amount;
        debit = e.amount;
      } else {
        credit = e.amount;
      }

      debugger;
      let bb: bankbalancedetaildto = {
        id: e.id,
        apartmentname: e.apartmentname,
        customername: e.customername,
        invoicename: e.invoicename,
        bank: e.bank,
        iban: e.iban,
        paymentmethod: e.paymentmethod,
        transactionid: e.transactionid,
        invoiceid: e.invoiceid,
        bankamount: bankamount,
        status: e.status,
        transactiondate: e.transactiondate,
        debit: debit,
        credit: credit,
      };

      this.bankbalancedetail.push(bb);
    });
    if(this.drp.option != "All" && this.drp.enddate != undefined)
    {
      this.bankbalancedetail = this.bankbalancedetail.filter(e=> new Date(e.transactiondate.seconds  * 1000) >= this.drp.startdate && new Date(e.transactiondate.seconds * 1000) <= this.drp.enddate)
    }
    //this.bankbalancedetail = this.bankbalancedetail.sort((a,b)=>{ return a > b ? 1 : -1 });
  }
  upcominginvoicesreport(st: Date, et: Date) {
    var dt = new Date();
    this.upcominginvoices = this.invoices.filter(
      (e) =>
        e.invoicepaid == false &&
        new Date(e?.invoicedueon?.seconds * 1000) > st &&
        new Date(e?.invoicedueon?.seconds * 1000) <= et
    );
  }
}
