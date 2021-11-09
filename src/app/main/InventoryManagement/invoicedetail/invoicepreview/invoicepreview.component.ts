import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { CoreSidebarService } from "@core/components/core-sidebar/core-sidebar.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { RouterHelper } from "app/auth/helpers/router-helper";
import { SalesDto } from "app/auth/models/plandto";
import { firebaseStoreService } from "app/auth/service/firebasestoreservice";
import { NotificationService } from "app/auth/service/notification.service";
import { throwIfEmpty } from "rxjs/operators";
import { ApputilsService } from "../../../../auth/helpers/apputils.service";
import { TransactiongeneratorComponent } from "../../transactiongenerator/transactiongenerator.component";
import { Transaction } from "../../../../auth/models/plandto";

@Component({
  selector: "app-invoicepreview",
  templateUrl: "./invoicepreview.component.html",
  styleUrls: ["./invoicepreview.component.scss"],
})
export class InvoicepreviewComponent implements OnInit {
  invoiceid: string;
  planid: string;
  showReportBasic = true;
  sale: SalesDto;
  transactions: Transaction[] = [];
  invoicedetail: import("/Users/a/MyProjects/MIS/MIS/src/app/auth/models/plandto").PlanScheduleDto;
  constructor(
    public route: ActivatedRoute,
    public routerser: Router,
    public modal: NgbModal,
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
    this.invoiceid = this.route.snapshot.paramMap.get("invoiceid");
    console.log(this.invoiceid);
    this.planid = this.route.snapshot.paramMap.get("id");
    this.getinvoice();

    this.fs
      .getSalebyId(this.planid)
      .valueChanges()
      .subscribe((e) => {
        this.sale = e;
      });
  }
  getinvoice() {
    this.fs
      .getinvoicebyid(this.invoiceid)
      .valueChanges()
      .subscribe((e) => {
        console.log(e);
        this.invoicedetail = e;
      });
    this.fs
      .gettransactions(this.invoiceid)
      .valueChanges()
      .subscribe((e) => {
        this.transactions = e;
      });
  }

  AddTransaction() {
    var dialogRef = this.modal.open(TransactiongeneratorComponent, {
      backdrop: false,
    });
    dialogRef.componentInstance.invoiceid = this.invoiceid;
  }
  ToggleTransaction(tr: Transaction) {
    this.fs
      .toggletransaction(
        this.invoiceid,
        tr.id,
        tr.status == this.ApputilsService.TransactionSuccessfull
          ? this.ApputilsService.TransactionInvalid
          : this.ApputilsService.TransactionSuccessfull
      )
      .then((e) => {
        this.nts.showSuccess("Transaction Status changed", "Transaction");
        
      });
  }
}
