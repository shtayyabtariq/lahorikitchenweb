import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';
import { ApputilsService } from 'app/auth/helpers/apputils.service';
import { Apartmentdto } from 'app/auth/models/apartmentdto';
import { GeneralConfirmationDialogDto } from 'app/auth/models/generalconfirmationdialogdto';
import { firebaseStoreService } from 'app/auth/service/firebasestoreservice';
import { NotificationService } from 'app/auth/service/notification.service';
import { ToastService } from 'app/auth/service/toasts.service';
import { GeneralconfirmationdialogComponent } from 'app/main/generalconfirmationdialog/generalconfirmationdialog.component';
import { DatatablesService } from 'app/modules/datatables.service';
import { Subject, Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { PlanDto } from '../../../auth/models/plandto';
import { ApartmentComponent } from '../createapartment/apartment/apartment.component';

@Component({
  selector: 'app-view-plan',
  templateUrl: './view-plan.component.html',
  styleUrls: ['./view-plan.component.scss']
})
export class ViewPlanComponent implements OnInit {

  public rows: any;
  public ColumnMode = ColumnMode;
  apt: PlanDto[] = [];

  qr: Subscription;
  filters: String[] = [];
  tempData: PlanDto[] = [];
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
    var e = await this.fs.getPlans().valueChanges().subscribe(e=>{
      this.apt = e;
      this.tempData = e as PlanDto[];
      this.apt = e as PlanDto[];
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

  AddNew() {
    this.modal.open(ApartmentComponent, {
      backdrop: false,
    }).closed.subscribe(e=>{
      // this.fetchApartment();
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
