import { Component, ElementRef, Inject, OnInit, ViewChild } from "@angular/core";
import { CoreSidebarService } from "@core/components/core-sidebar/core-sidebar.service";
import { firebaseStoreService } from "../../../auth/service/firebasestoreservice";
import { metadata, banksdto } from "../../../auth/models/metadata";
import { ActivatedRoute, Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { RouterHelper } from "app/auth/helpers/router-helper";
import { NotificationService } from "app/auth/service/notification.service";
import { ApputilsService } from "../../../auth/helpers/apputils.service";
import { CustomerDto } from "app/auth/models/customerinfo";
import { SalesDto } from "app/auth/models/plandto";
import { PlanScheduleDto } from "../../../auth/models/plandto";
import { FlatpickrOptions } from "ng2-flatpickr";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { DOCUMENT } from "@angular/common";
import { Console, debug } from "console";

@Component({
  selector: "app-invoicedetail",
  templateUrl: "./invoicedetail.component.html",
  styleUrls: ["./invoicedetail.component.scss"],
})
export class InvoicedetailComponent implements OnInit {
  metadata: metadata;
  showinvoice = false;
  sale: SalesDto;
  floorno:string = '';
  invoiceid: string;
  planid: string;
  cust: CustomerDto;
  previousamount:number = 0;
  invoicedetail: PlanScheduleDto;
  banksdto: banksdto;
  invoiceDate = new Date();
  dueDate = new Date();
  invoicedetailDesc:string;
  invoicedescription:string = "Description";
  amountInWords:string;
  customDesc:boolean = false;
  public InvoiceDateDto: FlatpickrOptions = {
    defaultDate: this.invoiceDate,
    altInput: true,
  };
  public DueDateDto: FlatpickrOptions = {
    defaultDate: this.dueDate,
    altInput: true,
  };

  constructor(
    @Inject(DOCUMENT) private document: Document,
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
    this.invoiceid = this.route.snapshot.paramMap.get("invoiceid");
    console.log(this.invoiceid);
    this.planid = this.route.snapshot.paramMap.get("id");
    this.getinvoice();
    this.fs
      .getmetadata()
      .valueChanges()
      .subscribe((e) => {
        this.metadata = e;
        console.log(this.metadata);
        this.showinvoice = true;
      });
    this.fs
      .getSalebyId(this.planid)
      .valueChanges()
      .subscribe((e) => {
        this.sale = e;
        this.fs.getapartmentbyid(this.sale.apartmentid).valueChanges().subscribe(e=>{
          this.floorno = e.floorno;
        });
        this.syncustomer(this.sale.customerid);
      });
      
  }
  async syncustomer(id: string) {
    this.fs
      .getCustomerbyId(id)
      .valueChanges()
      .subscribe((e) => {
        this.cust = e;
      });
    var credits =   await this.fs.getAllCustomerCredits(id).get().toPromise();
    debugger;
    credits.docs.forEach(e=>{
      this.previousamount += e.data().amount;
    });
  }
  onBankSelect($event) {
    this.banksdto = $event;
  }
  @ViewChild('pdfTable', { static: false }) pdfTable!: ElementRef;

  htmltoPDF() {
    
    debugger;
    if (window.screen.width < 1024) {
      this.document
        .getElementById('viewport')
        ?.setAttribute('content', 'width=1200px');
    }

    setTimeout(() => {
      html2canvas(this.pdfTable.nativeElement,{scrollY: -window.scrollY})
        .then((canvas) => {
          debugger;
          var pdf = new jsPDF("p", "pt", "a4");

          var imgData = canvas.toDataURL('image/jpeg', 1.0);
          window.open(imgData);

          var width = pdf.internal.pageSize.getWidth();
          var height = pdf.internal.pageSize.getHeight();

          pdf.addImage(imgData, 0, 0, width, height);
          pdf.save('converteddoc.pdf');
       

          if (window.screen.width < 1024) {
            document
              .getElementById('viewport')
              ?.setAttribute('content', 'width=device-width, initial-scale=1');
          }
        })
        .catch((e) => {
          debugger;
        });
    }, 1500);

    // parentdiv is the html element which has to be converted to PDF
  }
  getinvoice() {
    this.fs
      .getinvoicebyid(this.invoiceid)
      .valueChanges()
      .subscribe((e) => {
        console.log(e);
        this.invoicedetail = e;
        this.dueDate= new Date(this.invoicedetail?.invoicedueon.seconds * 1000);
        this.DueDateDto = {
          defaultDate: this.dueDate,
          altInput: true,
        };

        var dss = new Date(this.dueDate);
       
        dss.setDate(1);
        console.log(dss);
        this.invoiceDate = dss;
        this.InvoiceDateDto =  {
          defaultDate: this.invoiceDate,
          altInput: true,
        };
        debugger;
      
      });
  }

  configureInvoiceDescription()
  {
    
  }


}
