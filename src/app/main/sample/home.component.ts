import { Component, OnInit, QueryList, ViewChild, ViewChildren } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { firebaseStoreService } from "app/auth/service/firebasestoreservice";
import { ApputilsService } from "../../auth/helpers/apputils.service";
import { Transaction, PlanScheduleDto, SalesDto } from '../../auth/models/plandto';
import { FilteroptionselectComponent } from "../filteroptionselect/filteroptionselect.component";
import { daterangepickerdto } from "../../auth/models/daterangepickerdto";
import { InvoicereportComponent } from "../reports/invoicereport/invoicereport.component";
import { Apartmentdto, groupApartments } from '../../auth/models/apartmentdto';
import { compare, NgbdSortableHeader, SortEvent, ViewinventorymodalComponent } from "../InventoryManagement/viewinventorymodal/viewinventorymodal.component";
import { apartmenttypes } from "../../auth/models/apartmenttypesdto";
import { abort } from "process";
import { toInteger } from "@ng-bootstrap/ng-bootstrap/util/util";
import { firefunctionsservice } from "../../auth/service/firefunctionsservice";
import { ColumnMode, DatatableComponent } from "@swimlane/ngx-datatable";
import { ReportGenerator } from '../reports/reportgenerator';
import { ApartmentreportComponent } from '../reports/apartmentreport/apartmentreport.component';
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit {
  totaldueinvoices: number = 0;
  totalupcominginvoices: number = 0;
  totalsoldapartments: number = 0;
  totalavailableapartments: number = 0;
  totalownerapartments: number = 0;
  apartments: Apartmentdto[] = [];
  soldapartments: Apartmentdto[] = [];
  ownerapartments: Apartmentdto[] = [];
  unsoldapartments: Apartmentdto[] = [];
  transactions: Transaction[] = [];
  dueinvoices: PlanScheduleDto[] = [];
  overdueinvoices: PlanScheduleDto[] = [];
  totaloverdueinvoices: number = 0;
  upcominginvoices: PlanScheduleDto[] = [];
  totalAmountReceived = 0;
  drp: daterangepickerdto;
  sale:SalesDto[]=[];
  floorwiseapartments: groupApartments[] = [];
  typewiseapartments: groupApartments[] = [];
  apartmenttypes: groupApartments[] = [];
  beddingtypes: apartmenttypes[] = [];

  public rows: any;
  public ColumnMode = ColumnMode;
  @ViewChild(DatatableComponent) table: DatatableComponent;
  apt: Apartmentdto[] = [];

  constructor(
    public afs: firefunctionsservice,
    public modalservice: NgbModal,
    public fs: firebaseStoreService,
    public appUtil: ApputilsService
  ) {
    debugger;
  }

  public contentHeader: object;

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  async ngOnInit() {
    this.fs
      .getapartmenttypes()
      .valueChanges()
      .subscribe((e) => {
        this.beddingtypes = e;
      });
    this.totalAmountReceived = 0;
    this.contentHeader = {
      headerTitle: "Home",
      actionButton: true,
      breadcrumb: {
        type: "",
        links: [
          {
            name: "Home",
            isLink: true,
            link: "/",
          },
          {
            name: "Sample",
            isLink: false,
          },
        ],
      },
    };

    this.drp = this.appUtil.getMonthRange();
    this.fs
      .getapartments(false)
      .valueChanges()
      .subscribe((e) => {
        this.apartments = e as Apartmentdto[];
        this.totalavailableapartments = this.apartments.filter(
          (e) => e.status == this.appUtil.OpenStatus
        ).length;
        this.unsoldapartments = this.apartments.filter(
          (e) => e.status == this.appUtil.OpenStatus
        );
        this.soldapartments = this.apartments.filter(
          (e) => e.status == this.appUtil.BookedStatus
        );
        this.generateApartmentDistributions(this.apartments);
      });
    this.fs
      .getapartments(true)
      .valueChanges()
      .subscribe((e) => {
        this.totalownerapartments = e.length;
        this.ownerapartments = e as Apartmentdto[];
      });
      this.fs.getSales().valueChanges().subscribe(e=>{
        this.sale = e;
      });
    this.generatestats(this.drp);
  }

  async generateApartmentDistributions(ap: Apartmentdto[]) {
    debugger;
    this.floorwiseapartments = [];
    var result = this.appUtil.groupBy(
      ap,
      (Apartmentdto) => Apartmentdto.floorno
    );
    console.log(result);
    result.forEach((e) => {
      var soldapartments = e.filter(
        (e) => e.status == this.appUtil.BookedStatus
      );
      var openapartments = e.filter((e) => e.status == this.appUtil.OpenStatus);
      let flw: groupApartments = {
        type: e[0].floorno,
        availablecount: openapartments.length,
        soldcount: soldapartments.length,
        soldaparments: soldapartments,
        availableapartments: openapartments,

      };

      this.floorwiseapartments.push(flw);
    });

    this.apartmenttypes = [];

    result = this.appUtil.groupBy(ap, (Apartmentdto) => Apartmentdto.type);
    console.log(result);
    result.forEach((e) => {
      var soldapartments = e.filter(
        (e) => e.status == this.appUtil.BookedStatus
      );
      var openapartments = e.filter((e) => e.status == this.appUtil.OpenStatus);
      let flw: groupApartments = {
        type: e[0].type,
        availablecount: openapartments.length,
        soldcount: soldapartments.length,
        soldaparments: soldapartments,
        availableapartments: openapartments,
      };
      this.apartmenttypes.push(flw);
    });
    this.apartmenttypes.sort((a, b) =>
      Number.parseInt(a.type) > Number.parseInt(b.type) ? 1 : -1
    );

    this.typewiseapartments = [];

    result = this.appUtil.groupBy(
      ap,
      (Apartmentdto) => Apartmentdto.apartmenttype
    );
    console.log(result);
    result.forEach((e) => {
      var soldapartments = e.filter(
        (e) => e.status == this.appUtil.BookedStatus
      );
      var openapartments = e.filter((e) => e.status == this.appUtil.OpenStatus);
      debugger;
      console.log(
        this.beddingtypes.filter((a) => a.name === e[0].apartmenttype)
      );
      let flw: groupApartments = {
        type: e[0].apartmenttype,
        availablecount: openapartments.length,
        soldcount: soldapartments.length,
        soldaparments: soldapartments,
        availableapartments: openapartments,
        sort: this.beddingtypes.filter((a) => a.name == e[0].apartmenttype)[0]
          .orderno,
      };
      this.typewiseapartments.push(flw);
    });
    this.typewiseapartments = this.typewiseapartments.sort((a, b) =>
      a.sort > b.sort ? 1 : -1
    );
  }
  groupBy(list, keyGetter) {
    const map = new Map();
    list.forEach((item) => {
      const key = keyGetter(item);
      const collection = map.get(key);
      if (!collection) {
        map.set(key, [item]);
      } else {
        collection.push(item);
      }
    });
    return map;
  }
  async generatestats(drp: daterangepickerdto) {
    debugger;

    var dueinvoices = await this.fs.GetDueInvoices(new Date());
    this.dueinvoices = dueinvoices;
    this.totaldueinvoices = dueinvoices.length;

    var drpp = this.appUtil.getdatefilter(0);
    this.dueinvoices = this.dueinvoices.filter(
      (e) =>
        !e.invoicepaid &&
        new Date(e.invoicedueon.seconds * 1000) <= drpp.startdate &&
        new Date(e.invoicedueon.seconds * 1000) >= drpp.enddate
    );
    this.totaldueinvoices = this.dueinvoices.length;

    this.overdueinvoices = dueinvoices.filter(
      (e) =>
        !e.invoicepaid &&
        new Date(e.invoicedueon.seconds * 1000) <= drpp.enddate
    );
    this.totaloverdueinvoices = this.overdueinvoices.length;

    console.log(dueinvoices);
    if (drp.option != "All") {
      var resp = await this.fs.GetUpComingInvoices(new Date(), drp.enddate);
      console.log(resp);
      this.upcominginvoices = resp;
      this.totalupcominginvoices = resp.length;

      (
        await this.fs.getTotalAmountReceivedThisMonth(
          drp.startdate,
          drp.enddate
        )
      )
        .valueChanges()
        .subscribe((e) => {
          this.transactions = e;
          this.generateStatsByTransactions();
        });
    } else {
      var resp = await this.fs.GetAllUpComingInvoices(new Date());
      console.log(resp);
      this.upcominginvoices = resp;
      this.totalupcominginvoices = resp.length;

      (await this.fs.getAllTotalAmountReceivedThisMonth())
        .valueChanges()
        .subscribe((e) => {
          debugger;
          this.transactions = e;
          this.generateStatsByTransactions();
        });
    }
    //  var customerinvoice = await this.fs.GetCustomerUpComingInvoices("fqHbVfHDgvQz0GmNfJGD",new Date(),newdate);
    //  console.log(customerinvoice);

    this.totalsoldapartments = this.soldapartments.length;
  }
  generateStatsByTransactions() {
    this.totalAmountReceived = 0;
    this.transactions.forEach((e) => {
      this.totalAmountReceived += e.amount;
    });
  }

  viewinvoicedetail(id: number) {
    if (id == 0) {
      var modal = this.modalservice.open(InvoicereportComponent, {
        centered: true,
        size: "xl",
        backdrop: false,
      });
      var salesinfo = new ReportGenerator().getReportFromInvoices(this.upcominginvoices,this.sale);
      console.log(salesinfo);
      modal.componentInstance.invoices = salesinfo;
      modal.componentInstance.invoicetitle = "UpComing Invoices";
    } else if(id == 1) 
    {
      var modal = this.modalservice.open(InvoicereportComponent, {
        centered: true,
        size: "xl",
        backdrop: false,
      });
      var salesinfo = new ReportGenerator().getReportFromInvoices(this.overdueinvoices,this.sale);
      console.log(salesinfo);
      modal.componentInstance.invoices = salesinfo;
     // modal.componentInstance.invoices = this.overdueinvoices;
     modal.componentInstance.invoicetitle = "OverDue Invoices";
    }
    else{
      var modal = this.modalservice.open(InvoicereportComponent, {
        centered: true,
        size: "xl",
        backdrop: false,
      });
      var salesinfo = new ReportGenerator().getReportFromInvoices(this.dueinvoices,this.sale);
      console.log(salesinfo);
      modal.componentInstance.invoices = salesinfo;
      modal.componentInstance.invoicetitle = "Due Invoices";
     
    }
  }
  filter() {
    this.modalservice
      .open(FilteroptionselectComponent)
      .closed.subscribe((e) => {
        var drp = e as daterangepickerdto;
        console.log(drp);
        this.drp = drp;
        this.generatestats(this.drp);
      });
  }
  viewapartment(apt: Apartmentdto[]) {
    var modal = this.modalservice.open(ApartmentreportComponent, {
      centered: true,
      size: "xl",
      backdrop: false,
      scrollable:true
    });
    modal.componentInstance.apt = apt;
  }
  soldapartmentsreport(apt:Apartmentdto[],title:string)
  {
    let aptt = new ReportGenerator().getReportFromApartments(apt,this.sale);
   
    var modal = this.modalservice.open(ViewinventorymodalComponent, {
      centered: true,
      size: "xl",
      backdrop: false,
      scrollable:true
    });
    modal.componentInstance.apt = aptt;
    modal.componentInstance.PdfTitle = title;
    console.log(aptt);
  }


  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;

  onSort({ column, direction }: SortEvent) {
    debugger;
    // resetting other headers
    this.headers.forEach((header) => {
      if (header.sortable !== column) {
        header.direction = "";
      }
    });

    // sorting countries
    if (direction === "" || column === "") {
     this.floorwiseapartments = this.floorwiseapartments;
    } else {
      this.floorwiseapartments = [...this.floorwiseapartments].sort((a, b) => {
        const res = compare(a[column], b[column]);
        return direction === "asc" ? res : -res;
      });
    }
  }
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

    doc.setFontSize(5);
    doc.text(new Date().toDateString(), 5, 5);
    doc.setFontSize(14);
    doc.text("NIAZ ARBAZ PVT LTD", 30, 15);
    doc.setFontSize(10);

    doc.text("Floor Wise Apartments", 30, 20);

    var img = new Image();
    img.src = "/assets/images/Bedroonm.jpg";
    doc.addImage(img, "jpg", 10, 10, 12, 15);

    autoTable(doc, {
      html: ".ppdftable",
      startY: 30,
    }),
      doc.save("floorwiseapartments" + ".pdf");
  }
}
