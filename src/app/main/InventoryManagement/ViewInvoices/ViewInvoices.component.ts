import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RouterHelper } from 'app/auth/helpers/router-helper';
import { firebaseStoreService } from 'app/auth/service/firebasestoreservice';
import { NotificationService } from 'app/auth/service/notification.service';
import { ApputilsService } from '../../../auth/helpers/apputils.service';
import { AuthService } from '../../../auth/service/authservice';
import { Invoicedto } from '../../../auth/models/apartmentdto';
import { PlanScheduleDto, Transaction } from '../../../auth/models/plandto';
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';

@Component({
  selector: 'app-ViewInvoices',
  templateUrl: './ViewInvoices.component.html',
  styleUrls: ['./ViewInvoices.component.scss']
})
export class ViewInvoicesComponent implements OnInit {


  public rows: any;
  public ColumnMode = ColumnMode;
  

 
  filters: String[] = [];
  tempData: Transaction[] = [];
  @ViewChild(DatatableComponent) table: DatatableComponent;
  invoices:PlanScheduleDto[]=[];
  constructor(public modal: NgbModal,
 
    public route: ActivatedRoute,
    public routerser: Router,
    public ApputilsService: ApputilsService,
    public router: RouterHelper,
   public AuthService:AuthService,
    public nts: NotificationService,
    private _coreSidebarService: CoreSidebarService,
    public fs: firebaseStoreService) { }

  ngOnInit() {
    this.fs.getallinvoices().valueChanges().subscribe(e=>{
      this.invoices = e;
    });
  }

}
