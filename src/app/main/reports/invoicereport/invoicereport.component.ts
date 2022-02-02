import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { CoreSidebarService } from "@core/components/core-sidebar/core-sidebar.service";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { RouterHelper } from "app/auth/helpers/router-helper";
import { NotificationService } from "app/auth/service/notification.service";
import { firebaseStoreService } from "../../../auth/service/firebasestoreservice";
import { ApputilsService } from "../../../auth/helpers/apputils.service";
import { PlanScheduleDto } from "../../../auth/models/plandto";
import { InvoiceReportDto } from "../reportgenerator";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

@Component({
  selector: "app-invoicereport",
  templateUrl: "./invoicereport.component.html",
  styleUrls: ["./invoicereport.component.scss"],
})
export class InvoicereportComponent implements OnInit {
  invoices: InvoiceReportDto[] = [];
  invoicetitle:string;
  constructor(
    public modal: NgbActiveModal,

    public modalservice: NgbModal,
    public route: ActivatedRoute,
    public routerser: Router,
    public ApputilsService: ApputilsService,
    public router: RouterHelper,

    public nts: NotificationService,
    private _coreSidebarService: CoreSidebarService,
    public fs: firebaseStoreService
  ) {}

  async ngOnInit() {}

  dismissdialog() {
    this.modal.close();
  }
  generatePdf() {
    var head = [["ID", "Country", "Rank", "Capital"]];
    var body = [
      [1, "Denmark", 7.526, "Copenhagen"],
      [2, "Switzerland", 7.509, "Bern"],
      [3, "Iceland", 7.501, "Reykjavík"],
      [4, "Norway", 7.498, "Oslo"],
      [5, "Finland", 7.413, "Helsinki"],
    ];

    const doc = new jsPDF({
      orientation: "p",
      unit: "mm",
      format: "a4",
      putOnlyUsedFonts: true,
    });

    doc.setFontSize(5);
    doc.text(new Date().toDateString(), 5, 5);
    doc.setFontSize(14);
    doc.text("NIAZ ARBAZ PVT LTD", 30, 15);
    doc.setFontSize(10);

    doc.text(this.invoicetitle, 30, 20);

    var img = new Image();
    img.src = "/assets/images/Bedroonm.jpg";
    doc.addImage(img, "jpg", 10, 10, 12, 15);

    autoTable(doc, {
      html: ".pdftable",
      startY: 30,
    }),
      doc.save(this.invoicetitle + ".pdf");
  }
}
