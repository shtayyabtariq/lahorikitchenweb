import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AdvanceInventorySearch, Apartmentdto } from 'app/auth/models/apartmentdto';
import { apartmenttypes } from 'app/auth/models/apartmenttypesdto';
import { firebaseStoreService } from 'app/auth/service/firebasestoreservice';
import { ProgressdialogComponent } from 'app/main/progressdialog/progressdialog.component';
import { ApputilsService } from '../../../auth/helpers/apputils.service';


@Component({
  selector: 'app-advanceinventorysearch',
  templateUrl: './advanceinventorysearch.component.html',
  styleUrls: ['./advanceinventorysearch.component.scss']
})
export class AdvanceinventorysearchComponent implements OnInit {

  public form: FormGroup;
  isSubmit = false;
  showType = true;
  apartmenttype: String = "";
  type: String = "";
  status: String = "";
  apartment: Apartmentdto;
  start = false;
  apttypes: apartmenttypes[] = [];
  search:AdvanceInventorySearch;

  constructor(
    public fs: firebaseStoreService,
    public AppUtilApiService: ApputilsService,
    public ApputilsService: ApputilsService,
    public modal: NgbActiveModal,
    public modalservice: NgbModal,
    public formBuilder: FormBuilder
  ) {}

  async ngOnInit() {
    var apt = await this.fs.getapartmenttypes().get().toPromise();
    this.ApputilsService.ApartmentType = [];
    apt.forEach((e) => {
      this.apttypes.push(e.data());
      this.ApputilsService.ApartmentType.push(e.data().name);
    });
    this.apartmenttype =
      this.apartment == null
        ? this.ApputilsService.ApartmentType[0]
        : this.apartment.apartmenttype;
    this.type =
      this.apartment == null || this.apartment.type == undefined
        ? this.ApputilsService.Type[0]
        : this.apartment.type;
    this.status =
      this.apartment == null || this.apartment.status == undefined
        ? this.ApputilsService.Status[0]
        : this.apartment.status;
    if (this.apartment != null) {
      this.showTypes(this.apartment.apartmenttype);
    }
    this.form = this.formBuilder.group({
      apartmenttype: [
        this?.apartment?.apartmenttype ?? "",
        Validators.required,
      ],
     
      type: [this?.apartment?.type ?? ""],
    
      floorno: [this?.apartment?.floorno ?? "", ],
     
      price: [this?.apartment?.price ?? "", ],

    });
    this.start = true;
  }
  onApartmentTypeSelect(option: any) {
    console.log(option);
    this.showTypes(option);
  }
  showTypes(option) {
    if (
      option != this.ApputilsService.Apartment4BedDuplex &&
      option != this.ApputilsService.Apartment5BedDuplex &&
      option != this.ApputilsService.Penthouse
    ) {
      this.showType = true;
    } else {
      this.showType = false;
    }
  }
  onSubmit() {
    console.log("clicked");
    this.isSubmit = true;
    if (this.form.valid) {
      var pDialog = this.modalservice.open(ProgressdialogComponent, {
        windowClass: "transparent",
        backdrop: false,
        centered: true,
      });
      var aptype = this.form.controls["apartmenttype"].value;
      var type = this.form.controls["type"]?.value;
      var floorno = this.form.controls["floorno"]?.value ?? 0;
    
      var price = this.form.controls["price"]?.value ?? 0 ;
      
      let search:AdvanceInventorySearch={
        type: type,
        apartmenttype: aptype as string,
        budget: price,
        floorno: floorno
      };
      pDialog.close();
      this.modal.close(search);
      



    
      
      
    }
  }

}
