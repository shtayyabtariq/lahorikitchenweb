import { Component, OnInit, ViewChild } from "@angular/core";
import { FormGroup, Validators, FormBuilder } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { CoreSidebarService } from "@core/components/core-sidebar/core-sidebar.service";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { RouterHelper } from "app/auth/helpers/router-helper";
import { creditamounts } from "app/auth/models/customerinfo";
import { banksdto, metadata } from "app/auth/models/metadata";
import {
  SalesDto,
  PlanScheduleDto,
  Transaction,
} from "app/auth/models/plandto";
import { firebaseStoreService } from "app/auth/service/firebasestoreservice";
import { NotificationService } from "app/auth/service/notification.service";
import { ProgressdialogComponent } from "app/main/progressdialog/progressdialog.component";
import { FlatpickrOptions } from "ng2-flatpickr";
import { ApputilsService } from "../../../auth/helpers/apputils.service";
import { FormsModule } from "@angular/forms";
import { NgSelectComponent } from "@ng-select/ng-select";
import { CustomerDto } from "../../../auth/models/customerinfo";
import { Invoicedto } from "../../../auth/models/apartmentdto";
@Component({
  selector: "app-creditadjustments",
  templateUrl: "./creditadjustments.component.html",
  styleUrls: ["./creditadjustments.component.scss"],
})
export class CreditadjustmentsComponent implements OnInit {
  sales: SalesDto[] = [];
  customerSales: SalesDto[] = [];

  saleinfo: SalesDto;
  invoices: PlanScheduleDto[] = [];
  invoiceid: string;

  Transaction: Transaction;
  invoiceselected: PlanScheduleDto;

  id: string;
  creditamount: creditamounts;
  customer: CustomerDto;
  amount: number = 0;
  transacitons: Transaction[] = [];
  istransactionsfetched = false;
  selectedapartment: any;
  @ViewChild("SelectSize") ngSelectComponent: NgSelectComponent;

  constructor(
    public modal: NgbActiveModal,

    public modalservice: NgbModal,
    public route: ActivatedRoute,
    public routerser: Router,
    public ApputilsService: ApputilsService,
    public router: RouterHelper,
    public FormBuilder: FormBuilder,
    public nts: NotificationService,
    private _coreSidebarService: CoreSidebarService,
    public fs: firebaseStoreService
  ) {}

  async ngOnInit() {
    this.fs
      .getalltransactions()
      .valueChanges()
      .subscribe((e) => {
        this.transacitons = e.filter((e) => e.amount != e.totalamount);
        this.istransactionsfetched = true;
      });

    this.fs
      .getSales()
      .valueChanges()
      .subscribe((e) => {
        this.sales = e;
        if (this.Transaction != undefined) {
        }
      });
  }
  async ontransactionselect(tr: Transaction) {
    console.log(this.ngSelectComponent);
    this.ngSelectComponent.handleClearClick();
    this.Transaction = tr;
    var invoice = (
      await this.fs.getinvoicebyid(tr.invoiceid).get().toPromise()
    ).data();
    var selectedSale = this.sales.filter((e) => e.id == invoice.planid)[0];
    this.customerSales = [];
    this.invoiceid = "";
    this.selectedapartment = null;
    this.customerSales = this.sales.filter(
      (e) => e.customerid == selectedSale.customerid
    );
    this.customer = (
      await this.fs.getCustomerbyId(selectedSale.customerid).get().toPromise()
    ).data();
    this.creditamount = (
      await this.fs
        .getCustomerCredits(selectedSale.customerid, this.Transaction.id)
        .get()
        .toPromise()
    ).data();
    this.amount = this.creditamount.amount;
    this.invoices = [];
  }
  async oncustomselect(sale: SalesDto) {
    this.fetchinvoicesofsale(this.sales.filter((e) => e.id == sale.id)[0]);
  }
  invoiceselect(id: string) {
    debugger;
    this.invoiceid = id;
  }

  async fetchinvoicesofsale(sale: SalesDto) {
    this.invoices = [];
    this.saleinfo = sale;
    if (sale != undefined) {
      (
        await this.fs.getSaleInvoices(sale.id, 2).get().toPromise()
      ).docs.forEach((e) => {
        if (e.data().amountleft >= this.amount) {
          this.invoices.push(e.data());
          this.invoices = this.invoices.sort((f1, f2) =>
            f1.installmentno == null
              ? 1
              : f1.installmentno > f2.installmentno
              ? 1
              : -2
          );
        }
      });
      this.invoiceid = this.invoices.length > 0 ? this.invoices[0].id : "";
    }
  }
  async onSubmit() {
    if (this.invoiceid.length != 0) {
      var pDialog = this.modalservice.open(ProgressdialogComponent, {
        windowClass: "transparent",
        backdrop: false,
        centered: true,
      });
      var Invoicedto = this.invoices.filter((i) => i.id == this.invoiceid)[0];
      let tr: Transaction = {
        totalamount: this.creditamount.amount,
        amount: this.creditamount.amount,
        id: "",
        apartmentname: this.saleinfo.apartmentname,
        customername: this.customer.name + " " + this.customer.fathername,
        invoicename: Invoicedto.type + " ",
        bank: this.Transaction.bank,
        iban: this.Transaction.iban,
        paymentmethod: this.Transaction.paymentmethod,
        transactionid: this.Transaction.transactionid,
        invoiceid: this.invoiceid,
        createdat: this.ApputilsService.getServerTimestamp(),
        status: this.Transaction.status,
        updatedat: this.ApputilsService.getServerTimestamp(),
        notes: "",
        transactiondate: this.Transaction.transactiondate,
        editable: false,
      };
      if (Invoicedto.type == "Installment") {
        tr.invoicename += Invoicedto.installmentno.toString();
      }
      await this.fs
        .addtransaction(tr, Invoicedto.id)
        .then(
          await this.fs
            .toggletransactionupdate(this.Transaction.id, false)
            .then(),
          await this.fs
            .deleteCustomerCredit(this.customer.id, this.Transaction.id)
            .then()
        );
      pDialog.close();
      this.modal.close();
    }
  }
}
