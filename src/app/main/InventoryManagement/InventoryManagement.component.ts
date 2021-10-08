import { Component, OnInit, ViewChild } from "@angular/core";
import { ColumnMode, DatatableComponent } from "@swimlane/ngx-datatable";
import { DatatablesService } from "app/modules/datatables.service";
import { Subject, Subscription } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { firebaseStoreService } from "../../auth/service/firebasestoreservice";
import { Apartmentdto } from '../../auth/models/apartmentdto';
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ApartmentComponent } from "./createapartment/apartment/apartment.component";
import { GeneralconfirmationdialogComponent } from "../generalconfirmationdialog/generalconfirmationdialog.component";
import { GeneralConfirmationDialogDto } from "../../auth/models/generalconfirmationdialogdto";
import { arch } from "os";
import { transition } from "@angular/animations";
import { TranslateModule } from "@ngx-translate/core";
import { ApputilsService } from '../../auth/helpers/apputils.service';
import { fn } from "@angular/compiler/src/output/output_ast";
import Swal from "sweetalert2";
import { ToastService } from '../../auth/service/toasts.service';
import { NotificationService } from '../../auth/service/notification.service';
import { PlanScheduleDto } from '../../auth/models/plandto';

@Component({
  selector: "app-InventoryManagement",
  templateUrl: "./InventoryManagement.component.html",
  styleUrls: ["./InventoryManagement.component.scss"],
})
export class InventoryManagementComponent implements OnInit {
  public rows: any;
  public ColumnMode = ColumnMode;
  apt: Apartmentdto[] = [];
  archive = "Owner Property";
  qr: Subscription;
  filters: String[] = [];
  tempData: Apartmentdto[] = [];
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
  
    this.fetchApartment();
  }
  // async fetchApartments(archive: boolean = false) {
  //   if (this.qr != undefined) {
  //     this.qr.unsubscribe();
  //   }
  //   var fb = await this.fs
  //     .getapartments(archive)
  //     .get()
  //     .toPromise();

  //       var e:Apartmentdto[] = [];
  //       fb.forEach(ob=>{
  //         e.push(ob.data() as Apartmentdto);
  //       });
  //       this.apt = [];
  //       this.tempData = e as Apartmentdto[];
  //       this.apt = e as Apartmentdto[];
  //       this.exportCSVData = e as Object[];
  // }
  viewArchive(event: any) {
    if (event.target.checked) {
      this.archive = "Add For Sale";
    } else {
      this.archive = "Owner Property";
    }
    this.fetchApartment(event.target.checked);
  }
  AddFilter(event: any) {
    debugger;
    var val = event.target.value;
    if (event.target.checked) {
      this.filters.push(val);
    } else {
      var index = this.filters.indexOf(val);
      this.filters.splice(index,1);
    }
    this.fetchApartment();
  }
  async fetchApartment(archive: boolean = false) {
    debugger;
    var e = await this.fs.getApartments(this.filters,archive);
    this.apt = [];
    this.tempData = e as Apartmentdto[];
    this.apt = e as Apartmentdto[];
    this.exportCSVData = e as Object[];
  }
  edit(row: Apartmentdto) {
    console.log("clicked");
    var dialogRef = this.modal.open(ApartmentComponent, {
      backdrop: false,
    });
    dialogRef.componentInstance.apartment = row;
    dialogRef.closed.subscribe(e=>{
      this.fetchApartment();
    });
  }
  OnDelete(row: Apartmentdto) {
    var mod = this.modal.open(GeneralconfirmationdialogComponent, {
      backdrop: false,
      centered: true,
    });
    let gcd: GeneralConfirmationDialogDto = {
      title: "Delete Apartment",
      message: "Delete " + row.name,
      confirmbuttontext: "Delete",
      cancelbuttontext: "",
    };
    mod.componentInstance.dto = gcd;
    mod.closed.subscribe((e) => {
      debugger;
      if (e) {
        this.fs
          .delete(row)
          .then((e) => {
            
              this.fetchApartment();
           
          })
          .catch((ct) => {});

      }
    });
  }

  AddNew() {
    this.modal.open(ApartmentComponent, {
      backdrop: false,
    }).closed.subscribe(e=>{
      this.fetchApartment();
    });
  }
  Archive(id: Apartmentdto, archive: boolean = true) {
    archive = !(archive);
    debugger;
    if(id.status != "Open")
    {
        Swal.fire({
          title:"Transfer Error",
          text:'Cannot Transfer, Apartment is not Open',
          icon: 'warning',
          showCancelButton:false,
          confirmButtonText:"OK"
        });
    }
    else{
      this.fs
      .archiveapartment(archive, id.docid)
      .then((e) => {
        this.nts.showSuccess("Operation Done","Success");
      })
      .catch((e) => {
        this.toast.show(e);
      });
    this.fetchApartment();
    }
    
  }

  /**
   * Search (filter)
   *
   * @param event
   */
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
