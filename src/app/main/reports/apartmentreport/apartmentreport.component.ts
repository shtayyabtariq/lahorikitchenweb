import {
  Component,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { CoreSidebarService } from "@core/components/core-sidebar/core-sidebar.service";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { RouterHelper } from "app/auth/helpers/router-helper";
import { firebaseStoreService } from "app/auth/service/firebasestoreservice";
import { NotificationService } from "app/auth/service/notification.service";
import { InvoiceReportDto } from "../reportgenerator";
import { ApputilsService } from "../../../auth/helpers/apputils.service";
import { ColumnMode, DatatableComponent } from "@swimlane/ngx-datatable";
import { Apartmentdto } from "app/auth/models/apartmentdto";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  compare,
  NgbdSortableHeader,
  SortEvent,
} from "app/main/InventoryManagement/viewinventorymodal/viewinventorymodal.component";

@Component({
  selector: "app-apartmentreport",
  templateUrl: "./apartmentreport.component.html",
  styleUrls: ["./apartmentreport.component.scss"],
})
export class ApartmentreportComponent implements OnInit {
  // exportAsConfig: ExportAsConfig = {
  //   type: 'pdf', // the type you want to download

  //   elementIdOrContent: 'datatable', // the id of html/table element
  // }
  public rows: any;
  public ColumnMode = ColumnMode;
  @ViewChild(DatatableComponent) table: DatatableComponent;
  apt: Apartmentdto[] = [];
  aptall: Apartmentdto[] = [];
  invoices: InvoiceReportDto[] = [];
  exportAsService: any;
  exportCSVData: Object[] = [];
  collectionSize = this.apt.length;
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
  ) {
    this.exportCSVData = this.apt as Object[];
  }

  //  export() {
  //   // download the file using old school javascript method
  //   this.exportAsService.save(this.exportAsConfig, 'My File Name').subscribe(() => {
  //     // save started
  //   });
  //   // get the data as base64 or json object for json type - this will be helpful in ionic or SSR
  //   this.exportAsService.get(this.config).subscribe(content => {
  //     console.log(content);
  //   });
  // }
  config(config: any) {
    throw new Error("Method not implemented.");
  }
  async ngOnInit() {
    //this.generatePdf();

    this.aptall = this.apt;
    this.collectionSize = this.apt.length;
    this.refreshApt();
  }

  dismissdialog() {
    this.modal.close();
  }
  generatePdf() {
    let app = this.apt;
    this.apt = this.aptall;

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

    doc.text("pd.pdf", 30, 20);

    var img = new Image();
    img.src = "/assets/images/Bedroonm.jpg";
    doc.addImage(img, "jpg", 10, 10, 12, 15);

    setTimeout(() => {
      // Or use javascript directly:
      autoTable(doc, {
        html: ".pdftable",
        startY: 30,
      }),
        doc.save("pd" + ".pdf");
      this.apt = app;
    }, 1000);
  }

  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;

  onSort({ column, direction }: SortEvent) {
    debugger;
    // resetting other headers
    this.headers.forEach((header) => {
      if (header.sortable !== column) {
        header.direction = "";
      }
    });

    // sorting countries
    if (direction === "" || column === "") {
      this.apt = this.apt;
    } else {
      
      this.aptall = [...this.aptall].sort((a, b) => {
        let res = compare(a[column],b[column]);
        if(column == "type")
        {
          res = compare(Number.parseInt( a[column]), Number.parseInt(b[column]));
        }
        
        return direction === "asc" ? res : -res;
      });
      this.refreshApt();
    }
  }
  page = 1;
  pageSize = 15;
  refreshApt() {
    debugger;
    this.apt = this.aptall
      .map((country, i) => ({ id: i + 1, ...country }))
      .slice(
        (this.page - 1) * this.pageSize,
        (this.page - 1) * this.pageSize + this.pageSize
      );
      
  }
}
