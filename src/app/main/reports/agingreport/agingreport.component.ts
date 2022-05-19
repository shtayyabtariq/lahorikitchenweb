import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';
import { RouterHelper } from 'app/auth/helpers/router-helper';
import { CustomerDto } from 'app/auth/models/customerinfo';
import { daterangepickerdto } from 'app/auth/models/daterangepickerdto';
import { AginReportDto, SalesDto, PlanScheduleDto, Transaction, bankbalancedetaildto, CustomersLedgerDto, InvoicesDetailDto, customersalesDto } from 'app/auth/models/plandto';
import { firebaseStoreService } from 'app/auth/service/firebasestoreservice';
import { NotificationService } from 'app/auth/service/notification.service';
import { FilteroptionselectComponent } from 'app/main/filteroptionselect/filteroptionselect.component';
import saveAs from 'file-saver';
import jsPDF, { TextOptionsLight } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { FlatpickrOptions } from 'ng2-flatpickr';
import { ApputilsService } from '../../../auth/helpers/apputils.service';

@Component({
  selector: 'app-agingreport',
  templateUrl: './agingreport.component.html',
  styleUrls: ['./agingreport.component.scss']
})
export class AgingreportComponent implements OnInit {

  public rows: any;
  public ColumnMode = ColumnMode;
  public currentCustomer: CustomerDto;
  viewall: boolean = false;
  filters: String[] = [];
  allaging: AginReportDto[] = [];
  tempallaging: AginReportDto[] = [];
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
  tempaginginvoices: PlanScheduleDto[] = [];
  upcominginvoices: PlanScheduleDto[] = [];
  drp: daterangepickerdto;
  selectedagingfilter: string = this.ApputilsService.Aging30;
  report: number = 0;
  filtertext: string = "Choose Filter Options";
  html: HTMLTableElement;
  selectedCustomer: CustomerDto;
  customerledgers: CustomersLedgerDto[] = [];
  overduecustomerinvoices: InvoicesDetailDto[] = [];
  upcomingcustomerinvoices: InvoicesDetailDto[] = [];
  exportCSVData:Object[]=[];

  invoiceDate = new Date();

  public InvoiceDateDto: FlatpickrOptions = {
    defaultDate: this.invoiceDate,
    altInput: true,
    onChange:(ir:any)=>
    {
      this.invoiceDate = ir[0];
      this.allagingreport();
    }
    
  };
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
    doc.text("NIAZ ARBAZ PVT LTD", 30, 15);
    doc.setFontSize(10);

    doc.text("Tayyab", 30, 20);

    var img = new Image();
    img.src = "/assets/images/Bedroonm.jpg";
    doc.addImage(img, "jpg", 10, 10, 12, 15);

    // Or use javascript directly:
    autoTable(doc, {
      html: ".pdftable",
      startY: 30,
    });

    doc.save("table.pdf");
  }
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
    this.allaging = this.tempallaging.filter(f=> f.id == this.currentCustomer.id)
    this.agingfilter(this.selectedagingfilter);
  }
  onviewall() {
    this.viewall = true;
    this.selectedCustomer = null;
    this.generatereports();
  }
  
 
    
  generatereports() {
    var monthRange = this.ApputilsService.getMonthRange();
    this.filterCustomerSales();
    this.agingreport("All");
   
  }

  filterCustomerSales() {
    debugger;
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
    debugger;
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
    debugger;
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
    debugger;
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
        id: ''
      };
      var salesdto = this.getCustomerSales(e.id);
      var drp = this.getdatefilter(0,this.invoiceDate);
      age.amount30 = salesdto.invoices
        .filter(
          (e) =>
            !e.invoicepaid &&
            new Date(e.invoicedueon?.seconds * 1000) < drp.startdate &&
            new Date(e.invoicedueon?.seconds * 1000) >= drp.enddate
        )
        .reduce((sum, current) => sum + current.amountleft, 0);

      drp = this.getdatefilter(31,this.invoiceDate);
      age.amount60 = salesdto.invoices
        .filter(
          (e) =>
            !e.invoicepaid &&
            new Date(e.invoicedueon?.seconds * 1000) < drp.startdate &&
            new Date(e.invoicedueon?.seconds * 1000) >= drp.enddate
        )
        .reduce((sum, current) => sum + current.amountleft, 0);

      drp = this.getdatefilter(61,this.invoiceDate);
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

      age.id = e.id;
      age.total = age.amount30 + age.amount60 + age.amount90 + age.amount100;
      debugger;
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
      id: ''
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
    this.tempallaging = this.allaging;
    this.exportCSVData = this.tempallaging as Object[];
  }
  getdatefilter(startdate: any,dt:Date) {
    debugger;
    if(dt == null || dt == undefined)
    {
      dt = new Date();
    }
    else{
      var dd = new Date(dt.getFullYear(),dt.getMonth(),dt.getDate(),)
    }
    dd.setDate(dt.getDate() - startdate);
    var d30 = new Date(dt.getFullYear(),dt.getMonth(),dt.getDate(),)
    d30.setDate(d30.getDate() - (startdate + 30));

    let drp: daterangepickerdto = {
      startdate: dd,
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
       
      });
  }

  agingfilter(filter: string) {
    
      this.agingreport(filter);
    
  }

  
  
  downloadFile(data: any) {
    debugger;
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
