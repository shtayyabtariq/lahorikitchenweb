import { Component, Directive, ElementRef, EventEmitter, Input, OnInit, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { Apartmentdto } from '../../../auth/models/apartmentdto';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';
import { RouterHelper } from 'app/auth/helpers/router-helper';
import { firebaseStoreService } from 'app/auth/service/firebasestoreservice';
import { NotificationService } from 'app/auth/service/notification.service';
import { InvoiceReportDto } from 'app/main/reports/reportgenerator';
import { ApputilsService } from '../../../auth/helpers/apputils.service';
import { ApartmentSoldReportDto } from '../../reports/reportgenerator';
import jsPDF, { HTMLOptions } from 'jspdf';
import { HttpHandler } from '@angular/common/http';
import TextOptionsLight from 'jspdf';
import autoTable from 'jspdf-autotable';
import { debug } from 'console';
@Directive({
  selector: 'th[sortable]',
  host: {
    '[class.asc]': 'direction === "asc"',
    '[class.desc]': 'direction === "desc"',
    '(click)': 'rotate()'
  }
})
export class NgbdSortableHeader {

  @Input() sortable: SortColumn = '';
  @Input() direction: SortDirection = '';
  @Output() sort = new EventEmitter<SortEvent>();

  rotate() {
    this.direction = rotate[this.direction];
    this.sort.emit({column: this.sortable, direction: this.direction});
  }
}
@Component({
  selector: 'app-viewinventorymodal',
  templateUrl: './viewinventorymodal.component.html',
  styleUrls: ['./viewinventorymodal.component.scss']
})
export class ViewinventorymodalComponent implements OnInit {

  @ViewChild('content') content:ElementRef;
  apt:ApartmentSoldReportDto[]=[];
  PdfTitle:string;
  exportCSVData: Object[] = [];
  constructor(public modal: NgbActiveModal,

    public modalservice: NgbModal,
    public route: ActivatedRoute,
    public routerser: Router,
    public ApputilsService: ApputilsService,
    public router: RouterHelper,
 
    public nts: NotificationService,
    private _coreSidebarService: CoreSidebarService,
    public fs: firebaseStoreService) { }

  async ngOnInit() {
   
    this.exportCSVData = this.apt as Object[];
  }

  dismissdialog()
  {
    this.modal.close();
  }
  public SavePDF(): void {  
    let content=this.content.nativeElement;  
    let doc = new jsPDF();  
    let _elementHandlers =  
    {  
      '#editor':function(element,renderer){  
        return true;  
      }  
    };  
   

  
    doc.html(content.innerHTML);  
  
    doc.save('test.pdf');  
  }  
 

  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;

  onSort({column, direction}: SortEvent) {
debugger;
    // resetting other headers
    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });

    // sorting countries
    if (direction === '' || column === '') {
      this.apt = this.apt;
    } else {
      this.apt = [...this.apt].sort((a, b) => {
        const res = compare(a[column], b[column]);
        return direction === 'asc' ? res : -res;
      });
    }
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

    doc.text(this.PdfTitle, 30, 20);

    var img = new Image();
    img.src = "/assets/images/Bedroonm.jpg";
    doc.addImage(img, "jpg", 10, 10, 12, 15);

    // Or use javascript directly:
    autoTable(doc, {
      html: ".pdftable",
      startY: 30,
    });

    doc.save(this.PdfTitle+".pdf");
  }

  

}








export type SortColumn = keyof ApartmentSoldReportDto | '';
export type SortDirection = 'asc' | 'desc' | '';
export const rotate: {[key: string]: SortDirection} = { 'asc': 'desc', 'desc': '', '': 'asc' };

export const compare = (v1: string | number, v2: string | number) => v1 < v2 ? -1 : v1 > v2 ? 1 : 0;

export interface SortEvent {
  column: SortColumn;
  direction: SortDirection;
}

