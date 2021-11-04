import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { CoreSidebarService } from "@core/components/core-sidebar/core-sidebar.service";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { RouterHelper } from "app/auth/helpers/router-helper";
import { firebaseStoreService } from "app/auth/service/firebasestoreservice";
import { NotificationService } from "app/auth/service/notification.service";
import { ApputilsService } from '../../../auth/helpers/apputils.service';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { banksdto } from "app/auth/models/metadata";
import { metadata } from "../../../auth/models/metadata";
import { Transaction } from "app/auth/models/plandto";
import { ProgressdialogComponent } from "app/main/progressdialog/progressdialog.component";
import { FlatpickrOptions } from "ng2-flatpickr";

@Component({
  selector: "app-transactiongenerator",
  templateUrl: "./transactiongenerator.component.html",
  styleUrls: ["./transactiongenerator.component.scss"],
})
export class TransactiongeneratorComponent implements OnInit {
  form: FormGroup;
  start = false;
  isSubmit = false;
  banksdto: banksdto;
  metadata: metadata;
  invoiceid:string;
  showinvoice = false;
  transactionstatus: string = this.ApputilsService.TransactionSuccessfull;
  paymentmethod:string = this.ApputilsService.PaymentMethod[0];
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
    this.fs
      .getmetadata()
      .valueChanges()
      .subscribe((e) => {
        this.metadata = e;
        console.log(this.metadata);
        this.showinvoice = true;
      });
    this.form = this.FormBuilder.group({
      amount: [null, [Validators.required]],
      notes: [null],
      status: [null, Validators.required],
      method: [null, Validators.required],
      tid: [null],
      invoicedate:[null,Validators.required]
    });

    this.start = true;
  }
  async onSubmit() {
    this.isSubmit = true;
    if(this.form.valid)
    {
      var pDialog = this.modalservice.open(ProgressdialogComponent, {
        windowClass: "transparent",
        backdrop: false,
        centered: true,
      });
      var amount = this.form.controls["amount"].value;
      var transactionid = this.form.controls["tid"].value;
      var notes = this.form.controls["notes"]?.value ?? "";
      var paymentmethod = this.form.controls["method"].value;
      var status = this.form.controls["status"].value;
      let tr:Transaction={
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
        transactiondate: this.invoiceDate
      }
      var invoice = (await this.fs.getinvoicebyid(this.invoiceid).get().toPromise()).data();
      this.fs.addtransaction(tr,this.invoiceid).then(async e=>{

          invoice.amountpaid = invoice.amountpaid+tr.amount;
          var amounttobepaid = invoice.amount-invoice.amountpaid;
          invoice.amountleft = amounttobepaid;
          invoice.invoicepaid = invoice.amountleft == 0;
          if(invoice.invoicepaid)
          {
            invoice.invoicepaidon = this.ApputilsService.getServerTimestamp();
          }
          await this.fs.updateinvoice(invoice).then();
          this.nts.showSuccess("Transaction & Invoices Updated","Success");
          pDialog.close();
          this.modal.close();
      }).catch(e=>{
        this.nts.showError("Some Error ","Error occured");

      });
    }
  }
  onBankSelect($event) {
    this.banksdto = $event;
  }

}
