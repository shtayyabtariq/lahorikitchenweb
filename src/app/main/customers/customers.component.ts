import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';
import { RouterHelper } from 'app/auth/helpers/router-helper';
import { firebaseStoreService } from 'app/auth/service/firebasestoreservice';
import { NotificationService } from 'app/auth/service/notification.service';
import { ApputilsService } from '../../auth/helpers/apputils.service';
import { CustomerDto } from '../../auth/models/customerinfo';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss']
})
export class CustomersComponent implements OnInit {
  public rows: any;
  public ColumnMode = ColumnMode;
  

 
  filters: String[] = [];
  
  @ViewChild(DatatableComponent) table: DatatableComponent;
  cust:CustomerDto[]=[];
  constructor(public modal: NgbModal,
 
    public route: ActivatedRoute,
    public routerser: Router,
    public ApputilsService: ApputilsService,
    public router: RouterHelper,
   
    public nts: NotificationService,
    private _coreSidebarService: CoreSidebarService,
    public fs: firebaseStoreService) { }

  ngOnInit() {
    this.fs.getCustomer().valueChanges().subscribe(e=>{
      this.cust =e;
    });
  }

}
