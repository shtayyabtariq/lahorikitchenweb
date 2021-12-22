import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { CoreSidebarService } from "@core/components/core-sidebar/core-sidebar.service";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { RouterHelper } from "app/auth/helpers/router-helper";
import { firebaseStoreService } from "app/auth/service/firebasestoreservice";
import { NotificationService } from "app/auth/service/notification.service";
import { ApputilsService, SaleStatus } from '../../../auth/helpers/apputils.service';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { banksdto } from "app/auth/models/metadata";
import { metadata } from "../../../auth/models/metadata";
import { Transaction } from "app/auth/models/plandto";
import { ProgressdialogComponent } from "app/main/progressdialog/progressdialog.component";
import { FlatpickrOptions } from "ng2-flatpickr";
import { SalesDto, PlanScheduleDto } from "../../../auth/models/plandto";
import { debug } from "console";
import { Invoicedto } from "../../../auth/models/apartmentdto";
import { creditamounts } from "../../../auth/models/customerinfo";
import { threadId } from "worker_threads";

@Component({
  selector: "app-transactiongenerator",
  templateUrl: "./transactiongenerator.component.html",
  styleUrls: ["./transactiongenerator.component.scss"],
})
export class TransactiongeneratorComponent implements OnInit {
  form: FormGroup;
  start = false;
  bank: string;
  isSubmit = false;
  apartmentid: string;
  banksdto: banksdto;
  metadata: metadata;
  sales: SalesDto[] = [];
  saleinfo: SalesDto;
  invoices: PlanScheduleDto[] = [];
  invoiceid: string;
  showinvoice = false;
  maxamount: number = 0;
  Transaction: Transaction;
  isupdate = false;
  invoiceselected: PlanScheduleDto;
  transactionstatus: string = this.ApputilsService.TransactionSuccessfull;
  paymentmethod: string = this.ApputilsService.PaymentMethod[0];
  invoiceDate = this.ApputilsService.getDateAfterMonths(new Date(), 2);

  public InvoiceDateDto: FlatpickrOptions = {
    defaultDate: this.invoiceDate,
    altInput: true,
    
  };

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

  ngOnInit() {
    if (this.Transaction != undefined) {
      this.apartmentid = this.Transaction.apartmentname;
      this.invoiceid = this.Transaction.invoiceid;
      this.paymentmethod = this.Transaction.paymentmethod;
      this.transactionstatus = this.Transaction.status;
      this.bank = this.Transaction.iban;
      this.invoiceDate = new Date(
        this.Transaction.transactiondate.seconds * 1000
      );
      this.InvoiceDateDto = {
        defaultDate: this.invoiceDate,
        altInput: true,
      };
      this.banksdto = {
        Name: this.Transaction.bank,
        Iban: this.Transaction.iban,
      };
      this.isupdate = true;
    }
    this.fs
      .getSales()
      .valueChanges()
      .subscribe((e) => {
        this.sales = e;
        if (this.Transaction != undefined) {
          this.fetchinvoicesofsale(
            this.sales.filter((e) => e.apartmentname == this.apartmentid)[0]
          );
        }
        this.start = true;
      });

    this.fs
      .getmetadata()
      .valueChanges()
      .subscribe((e) => {
        this.metadata = e;
        console.log(this.metadata);
        this.showinvoice = true;
      });
    this.form = this.FormBuilder.group({
      amount: [this.Transaction?.totalamount, [Validators.required]],
      notes: [this.Transaction?.notes],
      invoice: [this.Transaction?.invoiceid, Validators.required],
      status: [this.Transaction?.status, Validators.required],
      method: [this.Transaction?.paymentmethod, Validators.required],
      tid: [this.Transaction?.transactionid],
      invoicedate: [this.Transaction?.transactiondate, Validators.required],
    });
  }
  invoiceselect(id: string) {
    debugger;

    this.invoiceid = id;
    this.maxamount =
      this.invoices.length > 0
        ? this.invoices.filter((e) => e.id == id)[0].amountleft
        : 0;
  }

  async fetchinvoicesofsale(sale: SalesDto) {
    this.invoices = [];
    this.saleinfo = sale;
    if (sale != undefined) {
      (await this.fs.getSaleInvoices(sale.id).get().toPromise()).docs.forEach(
        (e) => {
          this.invoices.push(e.data());
          this.invoices = this.invoices.sort((f1, f2) => {
            if (f1.orderno != undefined) {
              return f1.orderno > f2.orderno ? 1:-2;
            } else {
              return f1.installmentno == null
                ? 1
                : f1.installmentno > f2.installmentno
                ? 1
                : -2;
            }
          });
        }
      );
      this.invoiceid = !this.isupdate ? this.invoices[0].id : this.invoiceid;
      debugger;
      this.maxamount = this.invoices[0].amountleft;
    }
  }
  async onSubmit() {
    this.isSubmit = true;
    if (this.form.valid) {
      var pDialog = this.modalservice.open(ProgressdialogComponent, {
        windowClass: "transparent",
        backdrop: false,
        centered: true,
      });
      debugger;
      var amount = this.form.controls["amount"].value;
      var transactionid = this.form.controls["tid"].value;
      var notes = this.form.controls["notes"]?.value ?? "";
      var paymentmethod = this.form.controls["method"].value;
      var status = this.form.controls["status"].value;
      var invoicedto = (
        await this.fs.getinvoicebyid(this.invoiceid).get().toPromise()
      ).data();

      let tr: Transaction = {
        amount: amount,
        id: "",
        bank: this.banksdto.Name,
        iban: this.banksdto.Iban,
        paymentmethod: paymentmethod,
        transactionid: transactionid,
        invoiceid: this.invoiceid,
        createdat: this.ApputilsService.getServerTimestamp(),
        status: status,
        updatedat: this.ApputilsService.getServerTimestamp(),
        notes: notes,
        transactiondate:
          this.invoiceDate[0] == undefined
            ? this.invoiceDate
            : this.invoiceDate[0],
        apartmentname: this.saleinfo.apartmentname,
        customername: this.saleinfo.customername,
        invoicename: invoicedto.type,
        totalamount: amount,
        editable: true,
      };
      debugger;
      var leftAmount = 0;
      if (!this.isupdate && amount > invoicedto.amountleft) {
        leftAmount = amount - invoicedto.amountleft;
        amount = invoicedto.amountleft;
        tr.amount = amount;
      } else if (this.isupdate && tr.amount > this.Transaction.amount) {
        invoicedto.amountleft = invoicedto.amountleft + this.Transaction.amount;

        if (amount > invoicedto.amountleft) {
          leftAmount = amount - invoicedto.amountleft;
          amount = leftAmount;
          tr.amount = invoicedto.amountleft;
        }
      }
      if (invoicedto.type == "Installment") {
        tr.invoicename += invoicedto.installmentno.toString();
      }
      debugger;
      if (this.Transaction != undefined) {
        tr.id = this.Transaction.id;
        this.fs
          .updatetransaction(tr)
          .then(async (e) => {
            if (leftAmount > 0) {
              let cr: creditamounts = {
                id: tr.id,
                amount: leftAmount,
                tid: tr.transactionid,
              };
              await this.fs
                .creditAmountToCustomer(this.saleinfo.customerid, cr)
                .then();
            }
            let allpaid = true;
            (await this.fs.getSaleInvoices(this.saleinfo.id).get().toPromise()).docs.forEach(e=>{
                if(!(e.data().invoicepaid && allpaid))
                {
                  allpaid = false;
                }
            });
            if(allpaid)
            {
              await this.fs.updateSaleStatus(this.saleinfo.id,SaleStatus.Completed).then();
            }
            this.nts.showSuccess("Transaction & Invoices Updated", "Success");
            pDialog.close();
            this.modal.close();
          })
          .catch((e) => {
            console.log(e);
            this.nts.showError("Some Error ", "Error occured");
          });
      } else {
        this.fs
          .addtransaction(tr, this.invoiceid)
          .then(async (e) => {
            debugger;
            if (leftAmount > 0) {
              let cr: creditamounts = {
                id: tr.id,
                amount: leftAmount,
                tid: tr.transactionid,
              };
              await this.fs
                .creditAmountToCustomer(this.saleinfo.customerid, cr)
                .then();
            }
            this.fs.getallinvoices()
            this.nts.showSuccess("Transaction & Invoices Updated", "Success");
            pDialog.close();
            this.modal.close();
          })
          .catch((e) => {
            console.log(e);
            this.nts.showError("Some Error ", "Error occured");
          });
      }
    }
  }
  onBankSelect($event) {
    this.banksdto = $event;
  }
}
