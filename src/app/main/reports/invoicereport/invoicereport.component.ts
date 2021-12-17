import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RouterHelper } from 'app/auth/helpers/router-helper';
import { NotificationService } from 'app/auth/service/notification.service';
import { firebaseStoreService } from '../../../auth/service/firebasestoreservice';
import { ApputilsService } from '../../../auth/helpers/apputils.service';
import { PlanScheduleDto } from '../../../auth/models/plandto';

@Component({
  selector: 'app-invoicereport',
  templateUrl: './invoicereport.component.html',
  styleUrls: ['./invoicereport.component.scss']
})
export class InvoicereportComponent implements OnInit {

  invoices:PlanScheduleDto[]=[];
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
   
  }

  dismissdialog()
  {
    this.modal.close();
  }

}
