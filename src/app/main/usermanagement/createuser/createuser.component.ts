import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RouterHelper } from 'app/auth/helpers/router-helper';
import { creditamounts } from 'app/auth/models/customerinfo';
import { banksdto, metadata } from 'app/auth/models/metadata';
import { SalesDto, PlanScheduleDto, Transaction } from 'app/auth/models/plandto';
import { firebaseStoreService } from 'app/auth/service/firebasestoreservice';
import { NotificationService } from 'app/auth/service/notification.service';
import { ProgressdialogComponent } from 'app/main/progressdialog/progressdialog.component';
import { FlatpickrOptions } from 'ng2-flatpickr';
import { ApputilsService } from '../../../auth/helpers/apputils.service';
import { User } from '../../../auth/models/user';
import { firefunctionsservice } from '../../../auth/service/firefunctionsservice';

@Component({
  selector: 'app-createuser',
  templateUrl: './createuser.component.html',
  styleUrls: ['./createuser.component.scss']
})
export class CreateuserComponent implements OnInit {
  form: FormGroup;

  isSubmit = false;
  user:User[]=[];
  userrole:string=this.ApputilsService.AdminRole;
  emailerror:string="";
  usr:User
  isedit = false;
  constructor(
    public modal: NgbActiveModal,

    public modalservice: NgbModal,
    public route: ActivatedRoute,
    public routerser: Router,
    public ApputilsService: ApputilsService,
    public router: RouterHelper,
    public FormBuilder: FormBuilder,
    public nts: NotificationService,
    private _coreSidebarService: CoreSidebarService,
    public fs: firebaseStoreService,
    public afs:firefunctionsservice
  ) {}

  ngOnInit() {
    


    this.form = this.FormBuilder.group({
      name:[this.usr?.name,Validators.required],
      email:[this.usr?.email,Validators.required],
      role:[this.usr?.role,Validators.required]
    });
    this.fs.getusers().valueChanges().subscribe(e=>{
      this.user = e;
    });
  }
  
  onRoleSelect(role:string)
  {

  }
  onSubmit()
  {
   
    this.isSubmit = true;
    var email  = this.form.controls["email"].value;
    var role = this.form.controls["role"].value;
    var name = this.form.controls["name"].value;
    if(!this.isedit && this.user.filter(e => e.email == email).length > 0)
    {
      this.emailerror = "Email Already Registered";
    }
    else{
      var modal = this.modalservice.open(ProgressdialogComponent, {
        windowClass: "transparent",
        backdrop: false,
        centered: true,
      });
      try{

        if(this.isedit)
        {
         
          this.usr.name = name;
          this.usr.role = role;
          this.fs.updateuser(this.usr).then(e=>{
            this.nts.showSuccess("User Updated","User Updated");
            modal.close();
            this.modal.close();
          });
        }
        else{
          let usr:User={
            uid: '',
            email: email,
            password: '',
            name: name,
            block: false,
            role: role
          };
          this.afs.createUser(usr).toPromise().then(e=>{
            modal.close();
            this.nts.showSuccess("User Created","User Created");
            this.modal.close();
          }).catch(e=>{
            modal.close();
            console.log(e);
          });
        }
        
      }
      catch(e)
      {

      }
    }
  }
}
