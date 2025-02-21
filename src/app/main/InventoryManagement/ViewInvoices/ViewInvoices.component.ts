import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { CoreSidebarService } from "@core/components/core-sidebar/core-sidebar.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { RouterHelper } from "app/auth/helpers/router-helper";
import { firebaseStoreService } from "app/auth/service/firebasestoreservice";
import { NotificationService } from "app/auth/service/notification.service";
import { ApputilsService } from "../../../auth/helpers/apputils.service";
import { AuthService } from "../../../auth/service/authservice";
import { Invoicedto } from "../../../auth/models/apartmentdto";
import { PlanScheduleDto, Transaction, SalesDto, InvoicesDetailDto } from '../../../auth/models/plandto';
import { ColumnMode, DatatableComponent } from "@swimlane/ngx-datatable";

@Component({
  selector: "app-ViewInvoices",
  templateUrl: "./ViewInvoices.component.html",
  styleUrls: ["./ViewInvoices.component.scss"],
})
export class ViewInvoicesComponent implements OnInit {
  public rows: any;
  public ColumnMode = ColumnMode;
  show  = false;

  filters: String[] = [];
  tempData: Transaction[] = [];
  @ViewChild(DatatableComponent) table: DatatableComponent;
  invoices: PlanScheduleDto[] = [];
  tempinvoice:PlanScheduleDto[]=[];
  sales:SalesDto[]=[];
  customerinvoices:InvoicesDetailDto[]=[];
  exportCSVData: Object[] = [];
  constructor(
    public modal: NgbModal,

    public route: ActivatedRoute,
    public routerser: Router,
    public ApputilsService: ApputilsService,
    public router: RouterHelper,
    public AuthService: AuthService,
    public nts: NotificationService,
    private _coreSidebarService: CoreSidebarService,
    public fs: firebaseStoreService
  ) {}

  ngOnInit() {
    this.fs.getSales().valueChanges().subscribe(e=>{
      this.sales = e;
      this.fs
      .getallinvoices()
      .valueChanges()
      .subscribe((e) => {
        
        this.invoices = e;
        this.invoices.forEach(i=>{

          i.invoicedueon = new Date(i.invoicedueon?.seconds * 1000);
          i.invoicepaidon = i.invoicepaid ? new Date(i.invoicepaidon?.seconds * 1000) : "";
        
          debugger;
          let idd:InvoicesDetailDto=i;
          idd.customer = this.sales.filter(s => s.id == i.planid)[0].customername;
          this.customerinvoices.push(idd);
        });
        this.show =true;
        this.tempinvoice = e;
        this.exportCSVData = e as Object[];
      
      });
    });
    
  }
  filterselect(val: string) {
    this.customerinvoices = [];
    this.tempinvoice.forEach(i=>{

   
      
      let idd:InvoicesDetailDto=i;
      idd.customer = this.sales.filter(s => s.id == i.planid)[0].customername;
      this.customerinvoices.push(idd);
    });
    debugger;
    switch (val) {
      case this.ApputilsService.All:
        this.invoices = this.tempinvoice;
        this.exportCSVData = this.invoices as Object[];
        break;
      case this.ApputilsService.ThisMonth:
        var drp = this.ApputilsService.getMonthRange();
       this.customerinvoices = this.customerinvoices.filter(
          (i) =>
            i.invoicedueon >= drp.startdate &&
            i.invoicedueon <= drp.enddate
        );
        break;
      case this.ApputilsService.ThisMonthDue:
        var drp = this.ApputilsService.getMonthRange();
        this.customerinvoices = this.customerinvoices .filter(
          (i) =>
          i.invoicedueon >= drp.startdate &&
          i.invoicedueon <= drp.enddate &&
            i.invoicepaid == false
        );
        break;
      case this.ApputilsService.ThisMonthPaid:
        var drp = this.ApputilsService.getMonthRange();
        this.customerinvoices = this.customerinvoices .filter(
          (i) =>
          i.invoicedueon >= drp.startdate &&
          i.invoicedueon <= drp.enddate &&
            i.invoicepaid
        );
        break;
      case this.ApputilsService.ThisMonthUpComing:
        var drp = this.ApputilsService.getMonthRange();
        this.customerinvoices = this.customerinvoices .filter(
          (i) =>
          i.invoicedueon >= new Date() &&
          i.invoicedueon <= drp.enddate &&
            i.invoicepaid == false
        );
        break;
        case this.ApputilsService.OverDue:
        var drp = this.ApputilsService.getMonthRange();
        this.customerinvoices = this.customerinvoices .filter(
          (i) =>
        
          i.invoicedueon <= drp.startdate &&
            i.invoicepaid == false
        );
        break;
      case this.ApputilsService.ThisYear:
        var drp = this.ApputilsService.getYearRange();
        this.customerinvoices = this.customerinvoices .filter(
          (i) =>
          i.invoicedueon >= drp.startdate &&
          i.invoicedueon <= drp.enddate &&
            i.invoicepaid == false
        );
        break;
      case this.ApputilsService.Due:
      
        this.customerinvoices = this.customerinvoices .filter(
          (i) =>
          
          i.invoicedueon <= new Date() &&
            i.invoicepaid == false
        );
        break;
        case this.ApputilsService.Paid:
      
          this.customerinvoices = this.customerinvoices .filter(
          (i) =>
          
            
            i.invoicepaid == true
        );
    }
    this.customerinvoices = this.customerinvoices.sort((a,b)=>{
      return a.invoicedueon >= b.invoicedueon ? 1:-1;
    });
    this.exportCSVData = this.customerinvoices  as Object[];
  }
}
