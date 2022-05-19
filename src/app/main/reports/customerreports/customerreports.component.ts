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
import saveAs from "file-saver";

import jsPDF, { TextOptions, TextOptionsLight } from "jspdf";
import "jspdf-autotable";
import autoTable from "jspdf-autotable";
import { disconnect } from "process";
import { InvoicesDetailDto,  } from '../../../auth/models/plandto';
import {
  AginReportDto,
  customersalesDto,
  CustomersLedgerDto,
} from "../../../auth/models/plandto";

@Component({
  selector: "app-customerreports",
  templateUrl: "./customerreports.component.html",
  styleUrls: ["./customerreports.component.scss"],
})
export class CustomerreportsComponent implements OnInit {
  public rows: any;
  public ColumnMode = ColumnMode;
  public currentCustomer: CustomerDto;
  viewall: boolean = false;
  filters: String[] = [];
  allaging: AginReportDto[] = [];
  ledger:Object[];
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
  ALLbalancedetail: bankbalancedetaildto[] = [];
  overdueinvoices: PlanScheduleDto[] = [];
  aginginvoices: PlanScheduleDto[] = [];
  upcominginvoices: PlanScheduleDto[] = [];
  drp: daterangepickerdto;
  selectedagingfilter: string = this.ApputilsService.Aging30;
  report: number = 0;
  reportName:string = ""; 
  filtertext: string = "Choose Filter Options";
  html: HTMLTableElement;
  selectedCustomer: CustomerDto;
  customerledgers: CustomersLedgerDto[] = [];
  overduecustomerinvoices: InvoicesDetailDto[] = [];
  upcomingcustomerinvoices: InvoicesDetailDto[] = [];
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
  generatePdf() {
    var head = [["ID", "Country", "Rank", "Capital"]];
    var body = [
      [1, "Denmark", 7.526, "Copenhagen"],
      [2, "Switzerland", 7.509, "Bern"],
      [3, "Iceland", 7.501, "Reykjavík"],
      [4, "Norway", 7.498, "Oslo"],
      [5, "Finland", 7.413, "Helsinki"],
    ];

    const doc = new jsPDF({
      orientation: "p",
      unit: "mm",
      format: "a4",
      putOnlyUsedFonts: true,
    });

    let txtOptions: TextOptionsLight = {};
    doc.setFontSize(5);
    doc.text(new Date().toDateString(), 5, 5);
    doc.setFontSize(14);
    doc.text("NIAZ ARBAZ PVT LTD",35, 15);
    doc.setFontSize(10);

    doc.text(this.reportName, 35, 20);

    var img = new Image();
    img.src = "/assets/images/logo/logo.png";
    doc.addImage(img, "jpg", 5, 5, 35, 30);

    // Or use javascript directly:
    autoTable(doc, {
      html: ".pdftable",
      startY: 40,
      headStyles:{
        fillColor:"#ac8b5f"
      }

    });

    doc.save(this.reportName+"-"+new Date().toLocaleDateString()+".pdf");
  }
  ngOnInit() {
    
this.reportName = this.ApputilsService.CustomerLedgerReport;
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
        this.onviewall();
      });

    let dr: daterangepickerdto = {
      startdate: new Date(),
      enddate: new Date(),
      option: "All",
    };
    this.drp = dr;
  }
  onCustomerSelect($event) {
    
    this.viewall = false;
    this.currentCustomer = $event;
    this.generateparticularreport(this.currentCustomer.id);
  }
  onviewall() {
    this.viewall = true;
    this.selectedCustomer = null;
    this.generateparticularreport();
  }
  generateparticularreport(id: string = "") {
    switch (this.report) {
      case 0:
        this.report = 2;
        this.generateparticularreport(id);
        break;
      case 1:
        this.filterCustomerSales();
        this.overdueinvoicesreport(this.drp);
        break;
      case 2:
        this.generatecustomerledgers(id);
        break;
      case 3:
        this.filterCustomerSales();
        this.upcominginvoicesreport(this.drp);
        break;
      case 4:
        break;
    }
  }
  onreportselect(val: any) {
    
    this.reportName = val;
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
    this.upcominginvoicesreport(this.drp);
  }
  generatecustomerledgers(id: string) {
   
    this.customerledgers = [];
    this.ALLbalancedetail = [];
    this.cust.forEach((e) => {
      let cld: CustomersLedgerDto = new CustomersLedgerDto();
      cld.cust = e;
      this.selectedCustomer = this.currentCustomer;
      this.currentCustomer = e;
      this.customersales = this.sales.filter(
        (e) => e.customerid == this.currentCustomer.id
      );
      this.customerinvoices = this.invoices.filter(
        (e) => this.customersales.filter((r) => r.id == e.planid).length > 0
      );
      this.customledgerreport();
      cld.bankbalances = this.bankbalancedetail;

      this.ALLbalancedetail = this.ALLbalancedetail.concat(cld.bankbalances);
    });
    debugger;
    if (id != "") {
      debugger;
      this.currentCustomer = this.selectedCustomer;
      this.ALLbalancedetail = this.ALLbalancedetail.filter(
        (e) => e.id == id
      );
    }
    console.log(this.customerledgers);
    this.ledger = this.customerledgers  as Object[];

   
  }
  filterCustomerSales() {
    
    if (this.viewall) {
      this.customersales = this.sales;
      this.customerinvoices = this.invoices;
    } else {
      this.customersales = this.sales.filter(
        (e) => e.customerid == this.currentCustomer.id
      );
      this.customerinvoices = this.invoices.filter(
        (e) => this.customersales.filter((r) => r.id == e.planid).length > 0
      );
    }
  }
  
  getCustomerSales(id: string) {
    
    let customersales = this.sales.filter((e) => e.customerid == id);
    let customerinvoices = this.invoices.filter(
      (e) => customersales.filter((r) => r.id == e.planid).length > 0
    );

    let cst: customersalesDto = {
      sales: customersales,
      invoices: customerinvoices,
    };
    return cst;
  }
  agingreport(startdate: any) {
    
    this.filterCustomerSales();
    if (startdate == "All") {
      startdate = 0;
      this.selectedCustomer = null;
      this.allagingreport();
    }
    var dt = new Date();
    dt.setDate(dt.getDate() - startdate);
    var d30 = new Date();
    d30.setDate(d30.getDate() - (startdate + startdate == "All" ? 91 : 31));
    this.aginginvoices = this.customerinvoices.filter(
      (e) =>
        !e.invoicepaid &&
        new Date(e.invoicedueon?.seconds * 1000) < dt &&
        new Date(e.invoicedueon?.seconds * 1000) >= d30
    );
  }
  allagingreport() {
    
    this.viewall = true;
    this.allaging = [];
    this.cust.forEach((e) => {
      let age: AginReportDto = {
        customername: e.name,
        amount30: 0,
        amount60: 0,
        amount90: 0,
        total: 0,
        amount100: 0,
        id: ""
      };
      var salesdto = this.getCustomerSales(e.id);
      var drp = this.getdatefilter(0);
      age.amount30 = salesdto.invoices
        .filter(
          (e) =>
            !e.invoicepaid &&
            new Date(e.invoicedueon?.seconds * 1000) < drp.startdate &&
            new Date(e.invoicedueon?.seconds * 1000) >= drp.enddate
        )
        .reduce((sum, current) => sum + current.amountleft, 0);

      drp = this.getdatefilter(31);
      age.amount60 = salesdto.invoices
        .filter(
          (e) =>
            !e.invoicepaid &&
            new Date(e.invoicedueon?.seconds * 1000) < drp.startdate &&
            new Date(e.invoicedueon?.seconds * 1000) >= drp.enddate
        )
        .reduce((sum, current) => sum + current.amountleft, 0);

      drp = this.getdatefilter(61);
      age.amount90 = salesdto.invoices
        .filter(
          (e) =>
            !e.invoicepaid &&
            new Date(e.invoicedueon?.seconds * 1000) < drp.startdate &&
            new Date(e.invoicedueon?.seconds * 1000) >= drp.enddate
        )
        .reduce((sum, current) => sum + current.amountleft, 0);

      age.amount100 = salesdto.invoices
        .filter(
          (e) =>
            !e.invoicepaid &&
            new Date(e.invoicedueon?.seconds * 1000) < drp.enddate
        )
        .reduce((sum, current) => sum + current.amountleft, 0);

      age.total = age.amount30 + age.amount60 + age.amount90 + age.amount100;
      
      this.allaging.push(age);
    });

    let totalage: AginReportDto = {
      customername: "Total",
      amount30: this.allaging.reduce(
        (sum, current) => sum + current.amount30,
        0
      ),
      amount60: this.allaging.reduce(
        (sum, current) => sum + current.amount60,
        0
      ),
      amount90: this.allaging.reduce(
        (sum, current) => sum + current.amount90,
        0
      ),
      total: this.allaging.reduce((sum, current) => sum + current.total, 0),
      amount100: this.allaging.reduce(
        (sum, current) => sum + current.amount100,
        0
      ),
      id: ""
    };
    this.allaging.push(totalage);
    // var dt = new Date();
    // dt.setDate(dt.getDate() - startdate);
    // var d30 = new Date();
    // d30.setDate(d30.getDate() - (startdate + startdate == "All" ? 91:31));
    // this.aginginvoices = this.customerinvoices.filter(
    //   (e) =>
    //   (!e.invoicepaid)&&
    //     new Date(e.invoicedueon?.seconds * 1000) < dt &&
    //     new Date(e.invoicedueon?.seconds * 1000) >= d30
    // );
  }
  getdatefilter(startdate: any) {
    var dt = new Date();
    dt.setDate(dt.getDate() - startdate);
    var d30 = new Date();
    d30.setDate(d30.getDate() - (startdate + startdate == "All" ? 91 : 31));

    let drp: daterangepickerdto = {
      startdate: dt,
      enddate: d30,
    };
    return drp;
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
  overdueinvoicesreport(drp: daterangepickerdto) {
    
    var dt = new Date();
    drp.enddate = dt;
    this.overduecustomerinvoices = [];
    this.overdueinvoices = this.customerinvoices.filter(
      (e) =>
        !e.invoicepaid &&
        (drp.option == "All" ||
          drp.startdate == undefined ||
          +new Date(e.invoicedueon?.seconds * 1000) >= +drp.startdate) &&
        (drp.enddate == undefined ||
          +new Date(e.invoicedueon?.seconds * 1000) <= +drp.enddate)
    );

    this.overdueinvoices.forEach((e) => {
      let overdcustomer: InvoicesDetailDto = {
        installmentno: e.installmentno,
        amount: e.amount,
        amountpaid: e.amountpaid,
        amountleft: e.amountleft,
        invoicedueon: e.invoicedueon,
        invoicepaid: e.invoicepaid,
        invoicepaidon: e.invoicepaidon,
        approvedby: e.approvedby,
        approvalpicture: e.approvalpicture,
        id: e.id,
        planid: e.planid,
        type: e.type,
        createdat: e.createdat,
        updateat: e.updateat,
        orderno: e.orderno,
        customer: this.cust.filter(
          (d) =>
            d.id ==
            this.customersales.filter((c) => c.id == e.planid)[0].customerid
        )[0].name,
      };
      this.overduecustomerinvoices.push(overdcustomer);
    });
  }
  upcominginvoicesreport(drp: daterangepickerdto) {
    var dt = new Date();
    drp.startdate = dt;
    this.upcominginvoices = this.customerinvoices.filter(
      (e) =>
        !e.invoicepaid &&
        +new Date(e.invoicedueon?.seconds * 1000) > +drp.startdate &&
        (drp.option == "All" ||
          drp.enddate == undefined ||
          +new Date(e.invoicedueon?.seconds * 1000) <= +drp.enddate)
    );
    this.upcominginvoices = this.upcominginvoices.sort((e, b) => {
      return e.invoicedueon > b.invoicedueon ? 1 : -1;
    });
    this.upcomingcustomerinvoices = [];
    this.upcominginvoices.forEach((e) => {
      let overdcustomer: InvoicesDetailDto = {
        installmentno: e.installmentno,
        amount: e.amount,
        amountpaid: e.amountpaid,
        amountleft: e.amountleft,
        invoicedueon: e.invoicedueon,
        invoicepaid: e.invoicepaid,
        invoicepaidon: e.invoicepaidon,
        approvedby: e.approvedby,
        approvalpicture: e.approvalpicture,
        id: e.id,
        planid: e.planid,
        type: e.type,
        createdat: e.createdat,
        updateat: e.updateat,
        orderno: e.orderno,
        customer: this.cust.filter(
          (d) =>
            d.id ==
            this.customersales.filter((c) => c.id == e.planid)[0].customerid
        )[0].name,
      };
      this.upcomingcustomerinvoices.push(overdcustomer);
    });
  }
  agingfilter(filter: string) {
    if (filter == this.ApputilsService.Aging30) {
      this.agingreport(0);
    } else if (filter == this.ApputilsService.Aging60) {
      this.agingreport(31);
    } else if (filter == this.ApputilsService.Aging90) {
      this.agingreport(61);
    } else {
      this.agingreport("All");
    }
  }

  customledgerreport() {
    
    this.bankbalancedetail = [];
   

    this.customertransaction = this.transactions.filter(
      (e) => this.customerinvoices.filter((i) => i.id == e.invoiceid).length > 0
    );
    var bankamount = 0;
    this.customertransaction = this.customertransaction.sort((a, b) => {
      return a.transactiondate > b.transactiondate ? 1 : -1;
    });
    this.customerinvoices = this.customerinvoices.sort((a, b) => {
      return a.createdat < b.createdat ? 1 : -1;
    });
    
    this.customerinvoices.forEach((i) => {
      
      
      
        var debit = 0;
          var credit = 0;
  
         
          debit = i.amount;
          bankamount = 0;
        
          
          let sl = this.sales.filter(s => s.id == i.planid)[0];
          
          let bb: bankbalancedetaildto = {
            id: this.currentCustomer.id,
            apartmentname: sl.apartmentname,
            customername: "",
            invoicename: i.type+" "+(i.type == "Installment" ? i?.installmentno?.toString() ?? 0:""),
            bank: "",
            iban: "",
            paymentmethod: "",
            transactionid: "",
            invoiceid: i.id,
            bankamount: bankamount,
            status: "",
            transactiondate: i.invoicedueon,
            debit: debit,
            credit: credit,
          };
  
          this.bankbalancedetail.push(bb);
      
      
    });

    
    
    
      this.customertransaction.forEach((e) => {
        var debit = 0;
        var credit = 0;

        if (e.status == this.ApputilsService.TransactionSuccessfull) {
          credit = e.amount;
        }
       
     
        let bb: bankbalancedetaildto = {
          id: this.currentCustomer.id,
          apartmentname: e.apartmentname,
          customername: "",
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
    
      this.bankbalancedetail = this.bankbalancedetail.sort((a, b) => {
        return a.transactiondate == null || b.transactiondate == null ? 1:  b.transactiondate != null && a.transactiondate != null && new Date(a.transactiondate.seconds * 1000) > new Date(b.transactiondate.seconds * 1000) ? 1 : -1;
      });
    if (this.drp.option != "All" && this.drp.enddate != undefined) {
      this.bankbalancedetail = this.bankbalancedetail.filter(
        (e) =>
          new Date(e.transactiondate.seconds * 1000) >= this.drp.startdate &&
          new Date(e.transactiondate.seconds * 1000) <= this.drp.enddate
      );

    }



    let debit = 0;
    let credit = 0;
    let total = 0;
    this.bankbalancedetail.forEach(e=>{
      
        e.bankamount = (total+e.debit) - e.credit;
        debit += e.debit;
        credit += e.credit;
        total = e.bankamount;
      
    });
    if(this.bankbalancedetail.length > 0)
    {
      this.bankbalancedetail.length > 0 ?  this.bankbalancedetail[0].customername = this.currentCustomer.name : "";
    
      let bb: bankbalancedetaildto = {
        id: this.currentCustomer.id,
        apartmentname:"",
        customername: "Total",
        invoicename: "",
        bank: "",
        iban: "",
        paymentmethod: "",
        transactionid: "",
        invoiceid: "",
        bankamount: total,
        status: "",
        transactiondate: "",
        debit: debit,
        credit: credit,
      };
      
      this.bankbalancedetail.push(bb);
    }
  
   
    
    //this.bankbalancedetail = this.bankbalancedetail.sort((a,b)=>{ return a > b ? 1 : -1 });
  }

  ledgercsv()
  {
      this.ALLbalancedetail.forEach(e=>{

        e.transactiondate = new Date(e.transactiondate?.seconds * 1000);
      });
    this.downloadFile(this.ALLbalancedetail);
  }
  downloadFile(data: any) {
    
    const replacer = (key, value) => value === null ? '' : value; // specify how you want to handle null values here
    const header = Object.keys(data[0]);
    let csv = data.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','));
    csv.unshift(header.join(','));
    let csvArray = csv.join('\r\n');

    var blob = new Blob([csvArray], {type: 'text/csv' })
    saveAs(blob, "myFile.csv");
}


  // upcominginvoicesreport(st: Date, et: Date) {
  //   var dt = new Date();
  //   this.upcominginvoices = this.invoices.filter(
  //     (e) =>
  //       e.invoicepaid == false &&
  //       new Date(e?.invoicedueon?.seconds * 1000) > st &&
  //       new Date(e?.invoicedueon?.seconds * 1000) <= et
  //   );
  // }
}
