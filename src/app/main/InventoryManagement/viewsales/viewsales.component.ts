import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';
import { ApputilsService } from 'app/auth/helpers/apputils.service';
import { GeneralConfirmationDialogDto } from 'app/auth/models/generalconfirmationdialogdto';
import { PlanDto } from 'app/auth/models/plandto';
import { firebaseStoreService } from 'app/auth/service/firebasestoreservice';
import { NotificationService } from 'app/auth/service/notification.service';
import { ToastService } from 'app/auth/service/toasts.service';
import { GeneralconfirmationdialogComponent } from 'app/main/generalconfirmationdialog/generalconfirmationdialog.component';
import { DatatablesService } from 'app/modules/datatables.service';
import { Subscription, Subject } from 'rxjs';
import { ApartmentComponent } from '../createapartment/apartment/apartment.component';
import { SalesDto } from '../../../auth/models/plandto';

@Component({
  selector: 'app-viewsales',
  templateUrl: './viewsales.component.html',
  styleUrls: ['./viewsales.component.scss']
})
export class ViewsalesComponent implements OnInit {

  public rows: any;
  public ColumnMode = ColumnMode;
  apt: SalesDto[] = [];

  qr: Subscription;
  filters: String[] = [];
  tempData: SalesDto[] = [];
  @ViewChild(DatatableComponent) table: DatatableComponent;
  private _unsubscribeAll: Subject<any>;
  exportCSVData: Object[] = [];
  constructor(
    public modal: NgbModal,
    public toast:ToastService,
    public nts:NotificationService,
    private _datatablesService: DatatablesService,
    public fs: firebaseStoreService,
    public appUtil:ApputilsService
  ) {
    this._unsubscribeAll = new Subject();
  }

  apttypes:string[] = [];
  ngOnInit() {
    this.fetch();
    
  }
  
  
  
  async fetch() {
    debugger;
    var e = await this.fs.getSales().valueChanges().subscribe(e=>{
      this.apt = e;
      this.tempData = e ;
      this.apt = e ;
      this.exportCSVData = e as Object[];
    });
   
  }
  // edit(row: Apartmentdto) {
  //   console.log("clicked");
  //   var dialogRef = this.modal.open(ApartmentComponent, {
  //     backdrop: false,
  //   });
  //   dialogRef.componentInstance.apartment = row;
  //   dialogRef.closed.subscribe(e=>{
  //     this.fetchApartment();
  //   });
  // }
  OnDelete(row: PlanDto) {
    var mod = this.modal.open(GeneralconfirmationdialogComponent, {
      backdrop: false,
      centered: true,
    });
    let gcd: GeneralConfirmationDialogDto = {
      title: "Delete Plan",
      message: "Delete " + row.client,
      confirmbuttontext: "Delete",
      cancelbuttontext: "",
    };
    mod.componentInstance.dto = gcd;
    mod.closed.subscribe((e) => {
      debugger;
      if (e) {
        this.fs
          .deletePlanById(row.id)
          .then((e) => {
            
              // this.fetchApartment();
           
          })
          .catch((ct) => {});

      }
    });
  }

  

  
  filterUpdate(event) {
    debugger;
    const val = event.target.value.toLowerCase().trim().replace(/\s/g, "");

    const count = this.table.bodyComponent._columns.length;

    // get the key names of each column in the dataset
    const keys = Object.keys(this.tempData[0]);
    // assign filtered matches to the active datatable
    this.apt = this.tempData.filter((item) => {
      // iterate through each row's column data
      for (let i = 0; i < count; i++) {
        // check for a match
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
