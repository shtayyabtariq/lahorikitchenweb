import { Component, OnInit } from "@angular/core";
import { firebaseStoreService } from "../../../auth/service/firebasestoreservice";
import { SalesDto, PlanScheduleDto } from "../../../auth/models/plandto";
import { CustomerDto } from "../../../auth/models/customerinfo";
import { ActivatedRoute, Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { RouterHelper } from "app/auth/helpers/router-helper";
import { NotificationService } from "app/auth/service/notification.service";
import { ApputilsService } from "../../../auth/helpers/apputils.service";
import { ThisReceiver } from "@angular/compiler";
import { InvoiceType } from "../../../auth/helpers/apputils.service";

@Component({
  selector: "app-saledetail",
  templateUrl: "./saledetail.component.html",
  styleUrls: ["./saledetail.component.scss"],
})
export class SaledetailComponent implements OnInit {
  constructor(
    public modalservice: NgbModal,
    public route: ActivatedRoute,
    public routerser: Router,
    public fs: firebaseStoreService,
    public ApputilsService: ApputilsService,
    public router: RouterHelper,
    public nts: NotificationService
  ) {}
  sale: SalesDto;
  PlanScheduleDto: PlanScheduleDto[] = [];
  cust: CustomerDto;
  bookinginvoice: PlanScheduleDto;
  confirmationinvoice: PlanScheduleDto;
  agreementinvoice: PlanScheduleDto;
  possesioninvoice: PlanScheduleDto;
  installmentinvoice: PlanScheduleDto[] = [];
  viewsale = false;
  viewcustomer = false;
  viewinvoices = false;
  ngOnInit() {
    var planId = this.route.snapshot.paramMap.get("id");
    this.fs
      .getSalebyId(planId)
      .valueChanges()
      .subscribe((e) => {
        this.sale = e;
        this.viewsale = true;
        this.getInvoices(this.sale.id);
        this.syncustomer(this.sale.customerid);
      });
  }
  syncustomer(id: string) {
    this.fs
      .getCustomerbyId(id)
      .valueChanges()
      .subscribe((e) => {
        this.cust = e;
        this.viewcustomer = true;
      });
  }
  getInvoices(id: string) {
    this.fs
      .getSaleInvoices(id)
      .valueChanges()
      .subscribe((e) => {
        this.PlanScheduleDto = e;
        this.viewinvoices = true;
        this.agreementinvoice = this.PlanScheduleDto.filter(
          (e) => e.type == InvoiceType.Agreement
        )[0];
        this.bookinginvoice = this.PlanScheduleDto.filter(
          (e) => e.type == InvoiceType.Booking
        )[0];
        this.confirmationinvoice = this.PlanScheduleDto.filter(
          (e) => e.type == InvoiceType.Confirmation
        )[0];
        this.possesioninvoice = this.PlanScheduleDto.filter(
          (e) => e.type == InvoiceType.Posession
        )[0];
        this.installmentinvoice = this.PlanScheduleDto.filter(
          (e) => e.type == null ||   e.type == InvoiceType.Installment
        );
        this.installmentinvoice = this.installmentinvoice.sort((a,b)=>a.installmentno > b.installmentno ? 1 : -1);
      });
  }
  onPrint() {
    window.print();
  }
}
