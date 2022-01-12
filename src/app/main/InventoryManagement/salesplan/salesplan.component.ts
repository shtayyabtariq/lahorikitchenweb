import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Installments, SaleStatus } from '../../../auth/helpers/apputils.service';
import { RouterHelper } from "../../../auth/helpers/router-helper";
import { firebaseStoreService } from "../../../auth/service/firebasestoreservice";
import { Apartmentdto } from "../../../auth/models/apartmentdto";
import { ActivatedRoute, Router } from "@angular/router";
import {
  PlanDto,
  PlanScheduleDto,
  SalesDto,
} from "../../../auth/models/plandto";
import { ColumnMode, DatatableComponent, id } from "@swimlane/ngx-datatable";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ProgressdialogComponent } from "app/main/progressdialog/progressdialog.component";
import { NotificationService } from "app/auth/service/notification.service";
import { THIS_EXPR } from "@angular/compiler/src/output/output_ast";
import { FlatpickrOptions } from "ng2-flatpickr";
import { CustomerDto } from "../../../auth/models/customerinfo";
import {
  ApputilsService,
  InvoiceType,
} from "../../../auth/helpers/apputils.service";
import * as invoicemanagement from "../invoicemanagement";
import Swal from "sweetalert2";

@Component({
  selector: "app-salesplan",
  templateUrl: "./salesplan.component.html",
  styleUrls: ["./salesplan.component.scss"],
})
export class SalesplanComponent implements OnInit {
  public form: FormGroup;
  iscustomerfetch: boolean = false;
  addNew = false;
  isdisabled = false;
  currentCustomer: CustomerDto;
  customers: CustomerDto[] = [];
  isSubmit = false;
  bookingDate = new Date();
  public BookingDate:FlatpickrOptions={
    defaultDate: this.bookingDate,
    altInput: true,
    onChange:(newdate:any)=>{
      this.bookingDate = newdate[0];
    }
  }
  possessionDate = this.ApputilsService.getDateAfterMonths(new Date(),12*4);
  agreementDate = this.ApputilsService.getDateAfterMonths(new Date(), 2);
  confirmationDate = this.ApputilsService.getDateAfterMonths(new Date(), 1);
  public AgreementDate: FlatpickrOptions = {
    defaultDate: this.agreementDate,
    altInput: true,
    onChange:(newdate:any)=>{
      this.agreementDate = newdate[0];
      this.syncplanschedule();
    }
  };
  public PossessionDate: FlatpickrOptions = {
    defaultDate: this.possessionDate,
    altInput: true,
    onChange:(newdate:any)=>{
      this.possessionDate = newdate[0];
      
    }
  };
  public ConfirmationDate: FlatpickrOptions = {
    defaultDate: this.confirmationDate,
    altInput: true,
    onChange:(newdate:any)=>{
      this.confirmationDate = newdate[0];
    }
  };
  show: boolean = false;
  planId: string;
  rate: number;
  viewform: boolean = false;
  PlanSchedule: PlanScheduleDto[] = [];
  PlanInfo: PlanDto = {
    id: "",
    client: "",
    contact: "",
    plan: 0,
    installment: null,
    installmentamount: 0,
    agreement: 0,
    agreementamount: 0,
    possessionamount: 0,
    possession: 0,
    confirmation: 0,
    confirmationamount: 0,
    booking: 0,
    bookingamount: 0,
    plancreation: null,
    planscehdule: [],
    apartmentid: "",
    apartmentname: "",
    apartmentrate: 0,
    apartmenttotalprice: 0,
    apartmentarea: 0,
    createdat: null,
    updatedat: null,
    apartmenttype: "",
    type: "",
    totalamount: 0,
    perinstallmentamount: 0,
  };
  constructor(
    public modalservice: NgbModal,
    public route: ActivatedRoute,
    public routerser: Router,
    public fs: firebaseStoreService,
    public ApputilsService: ApputilsService,
    public FormBuilder: FormBuilder,
    public router: RouterHelper,
    public nts: NotificationService
  ) {}

  async ngOnInit() {
    this.form = this.FormBuilder.group({
      name: [null, [Validators.required]],
      fathername: [null, [Validators.required]],
      accountcode: [null, [Validators.required]],
      applicaitonno: [null, [Validators.required]],
      cnic: [null, [Validators.required]],
      nationality: [null, [Validators.required]],
      mailaddress: [null, [Validators.required]],
      permanentaddress: [null, [Validators.required]],
      email: [null, [Validators.required]],
      number: [null, [Validators.required]],
      officenumber: [null, [Validators.required]],
      source: [null, [Validators.required]],
      bname: [null, [Validators.required]],
    });
    this.fs
      .getCustomer()
      .valueChanges()
      .subscribe((e) => {
        this.customers = e;
        this.iscustomerfetch = true;
      });
    debugger;
    var planId = this.route.snapshot.paramMap.get("id");
    debugger;
    if (planId != null && planId != undefined) {
      this.planId = planId;
      this.PlanInfo = (
        await this.fs.getPlanById(planId).get().toPromise()
      ).data();
      debugger;
      this.PlanSchedule = this.PlanInfo.planscehdule;
      this.show = true;
    }
    this.syncplanschedule();
  }
  onCustomerSelect($event) {
    debugger;
    this.currentCustomer = $event;
    this.addNew = false;
    this.isdisabled = true;
    let form = this.FormBuilder.group({
      name: [
        { value: this.currentCustomer.name, disabled: this.isdisabled },
        [Validators.required],
      ],
      fathername: [
        { value: this.currentCustomer.fathername, disabled: this.isdisabled },
        [Validators.required],
      ],
      accountcode: [null, [Validators.required]],
      applicaitonno: [null, [Validators.required]],
      cnic: [
        { value: this.currentCustomer.cnic, disabled: this.isdisabled },
        [Validators.required],
      ],
      nationality: [
        { value: this.currentCustomer.nationality, disabled: this.isdisabled },
        [Validators.required],
      ],
      mailaddress: [
        { value: this.currentCustomer.mailaddress, disabled: this.isdisabled },
        [Validators.required],
      ],
      permanentaddress: [
        {
          value: this.currentCustomer.permanentaddress,
          disabled: this.isdisabled,
        },
        [Validators.required],
      ],
      email: [
        { value: this.currentCustomer.emailaddress, disabled: this.isdisabled },
        [Validators.required],
      ],
      number: [
        { value: this.currentCustomer.phonenumber, disabled: this.isdisabled },
        [Validators.required],
      ],
      officenumber: [
        { value: this.currentCustomer.office, disabled: this.isdisabled },
        [Validators.required],
      ],
      source: [
        {
          value: this.currentCustomer.sourceofincome,
          disabled: this.isdisabled,
        },
        [Validators.required],
      ],
      bname: [
        { value: this.currentCustomer.businessname, disabled: this.isdisabled },
        [Validators.required],
      ],
    });
    for (const field in form.controls) { // 'field' is a string
      if(field != "accountcode" && field != "applicaitonno")
      {
        this.form.get(field).disable();
      }
     
    }
    debugger;
   
    this.form = form;
    this.addNew = true;
  }
  addNewCustomer() {
    debugger;
    this.addNew = false;
    this.isdisabled = false;
    let form = this.FormBuilder.group({
      name: [{ value: null, disabled: this.isdisabled }, [Validators.required]],
      fathername: [{ value: null, disabled: this.isdisabled }, [Validators.required]],
      accountcode: [{ value: null, disabled: this.isdisabled }, [Validators.required]],
      applicaitonno: [{ value: null, disabled: this.isdisabled }, [Validators.required]],
      cnic: [{ value: null, disabled: this.isdisabled }, [Validators.required]],
      nationality: [{ value: null, disabled: this.isdisabled }, [Validators.required]],
      mailaddress: [{ value: null, disabled: this.isdisabled }, [Validators.required]],
      permanentaddress: [{ value: null, disabled: this.isdisabled }, [Validators.required]],
      email: [{ value: null, disabled: this.isdisabled }, [Validators.required]],
      number: [{ value: null, disabled: this.isdisabled }, [Validators.required]],
      officenumber: [{ value: null, disabled: this.isdisabled }, [Validators.required]],
      source: [{ value: null, disabled: this.isdisabled }, [Validators.required]],
      bname: [{ value: null, disabled: this.isdisabled }, [Validators.required]],
    });
    for (const field in form.controls) { // 'field' is a string
      this.form.get(field).enable();
    }
    this.form = form;
    this.addNew = true;
  }
  modalOpenVC(modalVC) {
    
    

    this.modalservice.open(modalVC, {
      centered: true,
      windowClass: "hello",
    });
  }
  syncplanschedule()
  {
    var i = 0;
    debugger;
    var incrementer = this.PlanInfo.installment.months;
    var currentPlanTime = 0 + incrementer;
    while (i < this.PlanInfo.planscehdule.length) {
      var dt = new Date(this.agreementDate);
      dt.setMonth(dt.getMonth());
      dt.setDate(15);
      this.PlanInfo.planscehdule[i].invoicedueon =
        this.ApputilsService.getDateAfterMonths(dt, currentPlanTime);
      i++;
      currentPlanTime += incrementer;
    }
  }
  async generateSales() {
    if (this.form.valid) {
      var apt = (await this.fs.getapartmentbyid(this.PlanInfo.apartmentid).get().toPromise()).data().status;
     var len = (await( this.fs.getSalebyApartment(this.PlanInfo.apartmentname)).get().toPromise()).docs.length;
    if(apt == this.ApputilsService.BookedStatus || len > 0 )
    {
      Swal.fire({
        title:"Sale Can not be generated",
        text:'Cannot Generate Sale, Apartment is not Open',
        icon: 'warning',
        showCancelButton:false,
        confirmButtonText:"OK"
      });
      return;
    }

   

      var pDialog = this.modalservice.open(ProgressdialogComponent, {
        windowClass: "transparent",
        backdrop: false,
        centered: true,
      });

      let cust: CustomerDto = {
        id: this.currentCustomer?.id ?? "",
        name: this.form.controls["name"].value,
        fathername: this.form.controls["fathername"].value,
        sex: false,
        cnic: this.form.controls["cnic"].value,
        nationality: this.form.controls["nationality"].value,
        mailaddress: this.form.controls["mailaddress"].value,
        permanentaddress: this.form.controls["permanentaddress"].value,
        emailaddress: this.form.controls["email"].value,
        phonenumber: this.form.controls["number"].value,
        office: this.form.controls["officenumber"].value,
        sourceofincome: this.form.controls["source"].value,
        businessname: this.form.controls["bname"].value,
        status: true
      };
      if (cust.id != undefined && cust.id.trim().length == 0) {
        cust.id = await this.fs.addCustomer(cust);
      }
      var agreementinvoice =
        invoicemanagement.InvoiceManagement.GenerateInvoice(
          InvoiceType.Agreement,
          this.PlanInfo.agreementamount,
          this.agreementDate,
          this.ApputilsService.getServerTimestamp(),
          2
        );
      var confirmationinvoice =
        invoicemanagement.InvoiceManagement.GenerateInvoice(
          InvoiceType.Confirmation,
          this.PlanInfo.confirmationamount,
          this.confirmationDate,
          this.ApputilsService.getServerTimestamp(),
          1
        );
      var bookinginvoice = invoicemanagement.InvoiceManagement.GenerateInvoice(
        InvoiceType.Booking,
        this.PlanInfo.bookingamount,
        this.bookingDate,
        this.ApputilsService.getServerTimestamp(),
        -1
      );
      var possesioninvoice =
        invoicemanagement.InvoiceManagement.GenerateInvoice(
          InvoiceType.Posession,
          this.PlanInfo.possessionamount,
          this.possessionDate,
          this.ApputilsService.getServerTimestamp(),
          1000000
        );
      this.PlanInfo.planscehdule.push(confirmationinvoice);
      this.PlanInfo.planscehdule.push(bookinginvoice);
      this.PlanInfo.planscehdule.push(possesioninvoice);
      this.PlanInfo.planscehdule.push(agreementinvoice);
      let sal: SalesDto = {
        id: "",
        customerid: cust.id,
        isallpaid: false,
        
        accountcode: this.form.controls["accountcode"].value,
        applicationno: this.form.controls["applicaitonno"].value,
        perinstallmentamount: this.PlanInfo.installmentamount,
        plan: this.PlanInfo.plan,
        installment: this.PlanInfo.installment,
        installmentamount: this.PlanInfo.installmentamount,
        agreement: this.PlanInfo.agreement,
        agreementamount: this.PlanInfo.agreementamount,
        possessionamount: this.PlanInfo.possessionamount,
        possession: this.PlanInfo.possession,
        confirmation: this.PlanInfo.confirmation,
        confirmationamount: this.PlanInfo.confirmationamount,
        booking: this.PlanInfo.booking,
        bookingamount: this.PlanInfo.bookingamount,
        plancreation: this.PlanInfo.plancreation,
        planscehdule: this.PlanInfo.planscehdule,
        apartmentid: this.PlanInfo.apartmentid,
        apartmentname: this.PlanInfo.apartmentname,
        apartmentrate: this.PlanInfo.apartmentrate,
        apartmenttotalprice: this.PlanInfo.apartmenttotalprice,
        apartmentarea: this.PlanInfo.apartmentarea,
        apartmenttype: this.PlanInfo.apartmenttype,
        type: this.PlanInfo.type,
        createdat: this.ApputilsService.getServerTimestamp(),
        updatedat: this.ApputilsService.getServerTimestamp(),
        totalamount: this.PlanInfo.apartmenttotalprice,
        totalamountpaid: 0,
        totalamountleft: this.PlanInfo.apartmenttotalprice,
        status: SaleStatus.InProgress,
        customername: cust.name+" "+cust.fathername,
        customercnic: cust.cnic
      };
      this.fs.addSales(sal).then(async (e) => {
        await this.fs.changeApartmentStatus(this.PlanInfo.apartmentid,this.ApputilsService.BookedStatus).then();
        pDialog.close();
        this.nts.showSuccess("Sales Generated", "Sales Info");
        this.routerser.navigateByUrl("/sales");
      });
    }
  }
}
