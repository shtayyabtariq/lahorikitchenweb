import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Apartmentdto } from "app/auth/models/apartmentdto";
import { apartmenttypes } from "app/auth/models/apartmenttypesdto";
import { ProgressdialogComponent } from "app/main/progressdialog/progressdialog.component";
import { ApputilsService } from "../../../../auth/helpers/apputils.service";
import { firebaseStoreService } from "../../../../auth/service/firebasestoreservice";

@Component({
  selector: "app-apartment",
  templateUrl: "./apartment.component.html",
  styleUrls: ["./apartment.component.scss"],
})
export class ApartmentComponent implements OnInit {
  public form: FormGroup;
  isSubmit = false;
  showType = true;
  apartmenttype: String = "";
  type: String = "";
  status: String = "";
  apartment: Apartmentdto;
  start = false;
  apttypes: apartmenttypes[] = [];

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
      name: [this?.apartment?.name ?? ""],
      type: [this?.apartment?.type ?? ""],
      discount: [this?.apartment?.discount ?? null],
      floorno: [this?.apartment?.floorno ?? "", [Validators.required]],
      netarea: [this?.apartment?.netarea ?? "", [Validators.required]],
      grossarea: [this?.apartment?.grossarea ?? "", [Validators.required]],
      status: [this?.apartment?.status ?? "", [Validators.required]],
      price: [this?.apartment?.price ?? "", [Validators.required]],
      notes: [this?.apartment?.notes ?? ""],
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
      var floorno = this.form.controls["floorno"].value;
      var discount = this.form.controls["discount"]?.value ?? null;
      var name = this.form.controls["name"]?.value;
      var netarea = this.form.controls["netarea"].value;
      var grossarea = this.form.controls["grossarea"].value;
      var status = this.form.controls["status"].value;
      var price = this.form.controls["price"].value;
      var notes = this.form.controls["notes"]?.value;
      let apartment: Apartmentdto = {
        name: name,
        id: "",
        isarchive: false,
        apartmenttype: aptype,
        netarea: netarea,
        floorno: floorno,
        discount: discount,
        grossarea: grossarea,
        status: status,
        price: price,
        // createdat: this.ApputilsService.getServerTimestamp(),
        // updatedat:this.ApputilsService.getServerTimestamp(),
        updatedby: "",
        notes: notes,
        updatedat: this.AppUtilApiService.getServerTimestamp(),
      };
      if (this.apartment != null) {
        apartment.docid = this.apartment.docid;
        apartment.createdat = this.apartment.createdat;
        apartment.createdby = this.apartment.createdby;
      } else {
        apartment.createdat = this.AppUtilApiService.getServerTimestamp();
        apartment.createdby = "";
      }
      apartment.totalprice = this.AppUtilApiService.getTotalPrice(
        apartment.grossarea,
        apartment.price,
        apartment.discount
      );

      console.log(type);
      apartment.type = this.showType ? type : null;
      var number = 1;

      console.log(
        new Intl.NumberFormat("en-IN", { minimumIntegerDigits: 2 }).format(
          number
        )
      );
      debugger;
      var apt: any;
      var aptyp = this.apttypes.filter(
        (e) => e.name == apartment.apartmenttype
      );
      var fn = new Intl.NumberFormat("en-IN", {
        minimumIntegerDigits: 2,
      }).format(Number.parseInt(apartment.floorno));
      var tp = new Intl.NumberFormat("en-IN", {
        minimumIntegerDigits: 2,
      }).format(Number.parseInt(apartment.type));
      apartment.name =
        fn +
        "F-" +
        aptyp[0].nameformat +
        "-T" +
        tp +
        "-" +
        apartment.grossarea;

      if (apartment.docid != undefined && apartment.docid != "") {
        apt = this.fs.updateapartments(apartment);
      } else {
        apt = this.fs.addapartments(apartment);
      }
      apt
        .then((e) => {
          pDialog.close();
          this.modal.close();
        })
        .catch((e) => {
          console.log(e);
          pDialog.close();
        });
    }
  }
}
