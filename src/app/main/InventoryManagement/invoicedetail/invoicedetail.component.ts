import { Component, OnInit } from "@angular/core";
import { CoreSidebarService } from "@core/components/core-sidebar/core-sidebar.service";
import { firebaseStoreService } from "../../../auth/service/firebasestoreservice";
import { metadata, banksdto } from '../../../auth/models/metadata';
import { ActivatedRoute, Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { RouterHelper } from "app/auth/helpers/router-helper";
import { NotificationService } from "app/auth/service/notification.service";
import { ApputilsService } from "../../../auth/helpers/apputils.service";
import { CustomerDto } from "app/auth/models/customerinfo";
import { SalesDto } from "app/auth/models/plandto";
import { PlanScheduleDto } from "../../../auth/models/plandto";
import { FlatpickrOptions } from "ng2-flatpickr";

@Component({
  selector: "app-invoicedetail",
  templateUrl: "./invoicedetail.component.html",
  styleUrls: ["./invoicedetail.component.scss"],
})
export class InvoicedetailComponent implements OnInit {
  metadata: metadata;
  showinvoice = false;
  sale: SalesDto;
  invoiceid: string;
  planid: string;
  cust: CustomerDto;
  invoicedetail: PlanScheduleDto;
  banksdto:banksdto;
  invoiceDate = this.ApputilsService.getDateAfterMonths(new Date(), 2);
  dueDate = this.ApputilsService.getDateAfterMonths(new Date(), 1);
  public InvoiceDateDto: FlatpickrOptions = {
    defaultDate: this.invoiceDate,
    altInput: true,
  };
  public DueDateDto: FlatpickrOptions = {
    defaultDate: this.dueDate,
    altInput: true,
  };


  constructor(
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
        this.syncustomer(this.sale.customerid);
      });
  }
  syncustomer(id: string) {
    this.fs
      .getCustomerbyId(id)
      .valueChanges()
      .subscribe((e) => {
        this.cust = e;
      });
  }
  onBankSelect($event)
  {
    this.banksdto = $event;
  }
  getinvoice() {
    this.fs
      .getinvoicebyid(this.invoiceid)
      .valueChanges()
      .subscribe((e) => {
        console.log(e);
        this.invoicedetail = e;
      });
  }
}
