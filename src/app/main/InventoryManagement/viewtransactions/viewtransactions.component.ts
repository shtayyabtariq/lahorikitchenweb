import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';

import { RouterHelper } from 'app/auth/helpers/router-helper';
import { Transaction } from 'app/auth/models/plandto';
import { firebaseStoreService } from 'app/auth/service/firebasestoreservice';
import { NotificationService } from 'app/auth/service/notification.service';
import { ApputilsService } from '../../../auth/helpers/apputils.service';
import { TransactiongeneratorComponent } from '../transactiongenerator/transactiongenerator.component';
import { CreditadjustmentsComponent } from '../creditadjustments/creditadjustments.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-viewtransactions',
  templateUrl: './viewtransactions.component.html',
  styleUrls: ['./viewtransactions.component.scss']
})
export class ViewtransactionsComponent implements OnInit {

  public rows: any;
  public ColumnMode = ColumnMode;
  

 
  filters: String[] = [];
  tempData: Transaction[] = [];
  @ViewChild(DatatableComponent) table: DatatableComponent;
  constructor(
    public modal: NgbModal,
 
    public route: ActivatedRoute,
    public routerser: Router,
    public ApputilsService: ApputilsService,
    public router: RouterHelper,
   
    public nts: NotificationService,
    private _coreSidebarService: CoreSidebarService,
    public fs: firebaseStoreService) { }

    transactions:Transaction[] = [];
  ngOnInit() {
    this.fs.getalltransactions().valueChanges().subscribe(e=>{
      this.transactions = e;
      this.tempData = e;
      
    });
  }
  add()
  {
    console.log("clicked");
    var dialogRef = this.modal.open(TransactiongeneratorComponent, {
      backdrop: false,
    });
   
    dialogRef.closed.subscribe(e=>{
      
    });
  }
  creditadjut()
  {
    console.log("clicked");
   
    var dialogRef = this.modal.open(CreditadjustmentsComponent, {
      backdrop: false,
    });
   
    dialogRef.closed.subscribe(e=>{
      
    });
  }
  edit(tr:Transaction)
  {
    if(!tr.editable)
    {
      Swal.fire(
        {
          title:"Transaction Locked",
          confirmButtonText:"OK"
        }
      );
      return;
    }
    console.log("clicked");
    var dialogRef = this.modal.open(TransactiongeneratorComponent, {
      backdrop: false,
    });
    dialogRef.componentInstance.Transaction = tr;
    dialogRef.closed.subscribe(e=>{
      
    });
  }
  async viewDetail(tr:Transaction)
  {
    var planId = (await this.fs.getinvoicebyid(tr.invoiceid).get().toPromise()).data().planid;
    this.routerser.navigateByUrl("/sales/"+planId+"/invoice/"+tr.invoiceid);

  }
  filterUpdate(event) {
    debugger;
    const val = event.target.value.toLowerCase().trim().replace(/\s/g, "");

    const count = Object.keys(this).length

    // get the key names of each column in the dataset
    const keys = Object.keys(this.tempData[1]);
    // assign filtered matches to the active datatable
    this.transactions = this.tempData.filter((item) => {
      // iterate through each row's column data
      for (let i = 0; i < keys.length; i++) {
        // check for a match
        debugger;
        if (item[keys[i]]) {
          var it = item[keys[i]]
            .toString()
            .toLowerCase()
            .trim()
            .replace(/\s/g, "");
          console.log(it);
          if (it.includes(val)) {
            // found match, return true to add to result set
            return true;
          }
        }
      }
    });

    // Whenever the filter changes, always go back to the first page
    this.table.offset = 0;
  }

}
