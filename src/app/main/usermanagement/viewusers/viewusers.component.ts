import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';
import { ApputilsService } from 'app/auth/helpers/apputils.service';
import { User } from 'app/auth/models';
import { Apartmentdto } from 'app/auth/models/apartmentdto';
import { firebaseStoreService } from 'app/auth/service/firebasestoreservice';
import { NotificationService } from 'app/auth/service/notification.service';
import { ToastService } from 'app/auth/service/toasts.service';
import { DatatablesService } from 'app/modules/datatables.service';
import { Subscription, Subject } from 'rxjs';
import { CreateuserComponent } from '../createuser/createuser.component';

@Component({
  selector: 'app-viewusers',
  templateUrl: './viewusers.component.html',
  styleUrls: ['./viewusers.component.scss']
})
export class ViewusersComponent implements OnInit {

  public rows: any;
  public ColumnMode = ColumnMode;
  apt: User[] = [];
  
 
  @ViewChild(DatatableComponent) table: DatatableComponent;
  private _unsubscribeAll: Subject<any>;
  exportCSVData: Object[] = [];
  constructor(  public modal: NgbModal,
    public toast:ToastService,
    public nts:NotificationService,
    private _datatablesService: DatatablesService,
    public fs: firebaseStoreService,
    public appUtil:ApputilsService) { }

  ngOnInit() {
    this.fs.getusers().valueChanges().subscribe(e=>{
      this.apt = e;
    });
  }
  edituser(usr:User)
  {
    var modal = this.modal.open(CreateuserComponent, {
      backdrop: false,
    });
    modal.componentInstance.usr = usr;
    modal.componentInstance.isedit = true;
  }
  addnewuser()
  {
    this.modal.open(CreateuserComponent, {
      backdrop: false,
    });
  }

}
