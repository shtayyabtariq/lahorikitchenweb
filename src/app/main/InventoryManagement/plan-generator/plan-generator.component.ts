import { ThrowStmt } from "@angular/compiler";
import { Route } from "@angular/compiler/src/core";
import { DOCUMENT } from '@angular/common';

import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { Component, ElementRef, Inject, OnInit, ViewChild } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import {
  ApputilsService,
  Installments,
} from "../../../auth/helpers/apputils.service";
import { RouterHelper } from "../../../auth/helpers/router-helper";
import { firebaseStoreService } from "../../../auth/service/firebasestoreservice";
import { Apartmentdto } from "../../../auth/models/apartmentdto";
import { ActivatedRoute, Router } from '@angular/router';
import { PlanDto, PlanScheduleDto } from '../../../auth/models/plandto';
import { ColumnMode, DatatableComponent, id } from "@swimlane/ngx-datatable";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ProgressdialogComponent } from "app/main/progressdialog/progressdialog.component";
import { NotificationService } from "app/auth/service/notification.service";
import { THIS_EXPR } from "@angular/compiler/src/output/output_ast";
import { InvoiceManagement } from '../invoicemanagement';
import { InvoiceType } from '../../../auth/helpers/apputils.service';
import Swal from "sweetalert2";

@Component({
  selector: "app-plan-generator",
  templateUrl: "./plan-generator.component.html",
  styleUrls: ["./plan-generator.component.scss"],
})
export class PlanGeneratorComponent implements OnInit {
  public form: FormGroup;
  isSubmit = false;
  apartment: Apartmentdto;
  installmentSelected: Installments;
  plan: number;
  aptId: string;
  show: boolean = false;
  isupdate = false;
  planId:string;
  rate:number;
  viewform: boolean = false;
  PlanSchedule: PlanScheduleDto[] = [];
  apartmentlist: Apartmentdto[] = [];
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
    perinstallmentamount: 0
  };
  @ViewChild(DatatableComponent) table: DatatableComponent;
  public ColumnMode = ColumnMode;
  constructor(
    @Inject(DOCUMENT) private document: Document,
    public modalservice: NgbModal,
    public route: ActivatedRoute,
    public routerser:Router,
    public fs: firebaseStoreService,
    public ApputilsService: ApputilsService,
    public FormBuilder: FormBuilder,
    public router: RouterHelper,
    public nts:NotificationService
  ) {}

  async ngOnInit() {
    this.installmentSelected = this.ApputilsService.InstallmentPlan[0];
    this.plan = 1;
    this.form = this.FormBuilder.group({
      contact: [null, [Validators.required]],
      client: [null, [Validators.required]],
      booking: [null, [Validators.required]],
      confirmation: [null, [Validators.required]],
      possession: [null, [Validators.required]],
      agreement: [null, [Validators.required]],
      installments: [null, [Validators.required]],
      plan: [null, [Validators.required]],
      rate:[null,Validators.required]
      // discount: [null],
    });
    debugger;
    var docs = await this.fs.getSALEapartments().get().toPromise();
    docs.docs.forEach((e) => {
      this.apartmentlist.push(e.data() as Apartmentdto);
    });

    if (this.route.snapshot.url[0].path == "generateplan") {
      var planId = this.route.snapshot.queryParamMap.get("id");
      if (planId != null && planId != undefined) {
        this.planId = planId;
        this.PlanInfo = (
          await this.fs.getPlanById(planId).get().toPromise()
        ).data();
        debugger;
        this.PlanSchedule = this.PlanInfo.planscehdule;
        this.show = true;
        this.isupdate = true;
        this.apartment = this.apartmentlist.filter(
          (e) => e.docid == this.PlanInfo.apartmentid
        )[0];


        this.form = this.FormBuilder.group({
          contact: [this?.PlanInfo?.contact ?? "", [Validators.required]],
          client: [this?.PlanInfo?.client ?? "", [Validators.required]],
          booking: [this?.PlanInfo?.booking ?? "", [Validators.required]],
          confirmation: [this?.PlanInfo?.confirmation ?? "", [Validators.required]],
          possession: [this?.PlanInfo?.possession ?? "", [Validators.required]],
          agreement: [this?.PlanInfo?.agreement ?? "", [Validators.required]],
          installments: [this?.PlanInfo?.installment ?? "", [Validators.required]],
          plan: [this?.PlanInfo?.plan ?? "", [Validators.required]],
          rate:[null,Validators.required]
          // discount: [null],
        });  
        this.installmentSelected = this.ApputilsService.InstallmentPlan.filter(e=>e.months == this.PlanInfo.installment.months)[0];
        this.plan = this.PlanInfo.plan;
        this.rate = this.PlanInfo.apartmentrate;
      } else {
        this.apartment = this.apartmentlist[0];
        this.rate = this.apartment.price;
      }
    } else {
      var id = this.route.snapshot.paramMap.get("id");
      if (id != undefined && id != null) {
        debugger;
        this.aptId = id;
        this.apartment = (
          await this.fs.getapartmentbyid(id).get().toPromise()
        )?.data();
      } else {
        this.apartment = this.apartmentlist[0];
      }
      this.rate = this.apartment.price;
    }
    

    this.viewform = true;
  }
  @ViewChild('pdfTable', { static: false }) pdfTable!: ElementRef;

  htmltoPDF() {
    
    debugger;
    if (window.screen.width < 1024) {
      this.document
        .getElementById('viewport')
        ?.setAttribute('content', 'width=1200px');
    }

    setTimeout(() => {
      html2canvas(this.pdfTable.nativeElement,{scrollY: -window.scrollY})
        .then((canvas) => {
          debugger;
          var pdf = new jsPDF('l', 'pt', [
            canvas.width + 100,
            canvas.height + 100,
          ]);

          var imgData = canvas.toDataURL('image/jpeg', 1.0);
          window.open(imgData);
          pdf.addImage(imgData, 0, 0, canvas.width, canvas.height);
          pdf.save('converteddoc.pdf');
       

          if (window.screen.width < 1024) {
            document
              .getElementById('viewport')
              ?.setAttribute('content', 'width=device-width, initial-scale=1');
          }
        })
        .catch((e) => {
          debugger;
        });
    }, 1500);

    // parentdiv is the html element which has to be converted to PDF
  }
  async onSubmit() {

    
    this.PlanSchedule = [];

    this.isSubmit = true;
    if (this.form.valid) {
      var pDialog = this.modalservice.open(ProgressdialogComponent, {
        windowClass: "transparent",
        backdrop: false,
        centered: true,
      });

      
    
      var contact = this.form.controls["contact"].value;
      var client = this.form.controls["client"].value;
      var booking = this.form.controls["booking"].value;
      var confirmation = this.form.controls["confirmation"].value;
      var possession = this.form.controls["possession"].value;
      var agreement = this.form.controls["agreement"].value;
      var installments = this.form.controls["installments"]
        .value as Installments;
      var plan = this.form.controls["plan"].value;
      var discount = 0;
      this.PlanInfo.apartmentarea = this.apartment.grossarea;
      let totalPrice: number;
     
        this.PlanInfo.apartmenttotalprice =
        this.ApputilsService.getTotalPrice(this.PlanInfo.apartmentarea,this.rate,null);
      
      totalPrice = this.PlanInfo.apartmenttotalprice;
      var confirmationPrice = this.ApputilsService.getPercentPrice(
        totalPrice,
        confirmation
      );
      var possessionPrice = this.ApputilsService.getPercentPrice(
        totalPrice,
        possession
      );
      var agreementPrice = this.ApputilsService.getPercentPrice(
        totalPrice,
        agreement
      );
      var bookingPrice = this.ApputilsService.getPercentPrice(
        totalPrice,
        booking
      );
      var installmentAmount =
        totalPrice -
        (confirmationPrice + bookingPrice + agreementPrice + possessionPrice);
      var totalInstallments = (plan * 12) / installments.months;
      var perInstallmentAmount = installmentAmount / totalInstallments;

      this.PlanInfo.client = client;
      this.PlanInfo.contact = contact;
      this.PlanInfo.perinstallmentamount = perInstallmentAmount;
      this.PlanInfo.plan = plan;
      this.PlanInfo.installment = installments;
      this.PlanInfo.agreement = agreement;
      this.PlanInfo.agreementamount = agreementPrice;
      this.PlanInfo.confirmation = confirmation;
      this.PlanInfo.confirmationamount = confirmationPrice;
      this.PlanInfo.booking = booking;
      this.PlanInfo.bookingamount = bookingPrice;
      this.PlanInfo.possession = possession;
      this.PlanInfo.possessionamount = possessionPrice;
      this.PlanInfo.contact = contact;
      this.PlanInfo.client = client;
      this.PlanInfo.type = this.apartment.type;
      this.PlanInfo.apartmenttype = this.apartment.apartmenttype;
      this.PlanInfo.installmentamount = installmentAmount;
      
      this.PlanInfo.apartmentid = this.apartment.docid;
      this.PlanInfo.apartmentname = this.apartment.name;
      this.PlanInfo.apartmentrate = this.rate;
      this.PlanInfo.totalamount = totalPrice;

      var incrementer = installments.months;
      var currentPlanTime = 0 + incrementer;
      var installmentNo = 1;
      this.PlanSchedule = [];
      while (installmentNo <= totalInstallments) {
        var getDateAfterthreeMonths = this.ApputilsService.getDateAfterMonths(
          new Date(),
          currentPlanTime
        );
        var ps: PlanScheduleDto = {
          installmentno: installmentNo,
          amount: perInstallmentAmount,
          invoicedueon: getDateAfterthreeMonths,
          invoicepaid: false,
          invoicepaidon: null,
          approvedby: null,
          approvalpicture: "",
          id: "",
          planid: "",
          amountpaid: 0,
          amountleft: perInstallmentAmount,
          type: InvoiceType.Installment,
          createdat: new Date(),
          updateat: new Date(),
          orderno: installmentNo+3
        };

        this.PlanSchedule.push(ps);
        installmentNo++;
        currentPlanTime += incrementer;
      }
      pDialog.close();
      this.PlanInfo.planscehdule = this.PlanSchedule;
      this.show = true;
    }
  }
  onPrint() {
    window.print();
  }
  onSave() {
    debugger;
   
    if (this.isupdate) {
      this.fs.updatePlanById(this.PlanInfo).then(async e=>{
        this.nts.showSuccess("Updated","Plan Updated");
        this.routerser.navigateByUrl("/plan");
      });
    } else {
      this.PlanInfo.createdat = this.ApputilsService.getServerTimestamp();
      this.fs.savePlan(this.PlanInfo).then(async (e) => {
        this.nts.showSuccess("Saved","Plan Saved");
        this.routerser.navigateByUrl("/plan");
      });
    }
  }
  onApartmentSelect(event: any) {
    this.apartment = event;
  }
}
