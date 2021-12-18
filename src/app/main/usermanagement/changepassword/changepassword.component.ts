import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RouterHelper } from 'app/auth/helpers/router-helper';
import { firebaseStoreService } from 'app/auth/service/firebasestoreservice';
import { NotificationService } from 'app/auth/service/notification.service';
import { AuthService } from '../../../auth/service/authservice';
import { ApputilsService } from '../../../auth/helpers/apputils.service';

@Component({
  selector: 'app-changepassword',
  templateUrl: './changepassword.component.html',
  styleUrls: ['./changepassword.component.scss']
})
export class ChangepasswordComponent implements OnInit {

  public form: FormGroup;
  public isupdate = false;
  public error:string;
  public isSubmit = false;
  public reminder: string;
  reminderDate = new Date()

  constructor(    
    public AuthService: AuthService,
    public modalservice: NgbModal,
    public route: ActivatedRoute,
    public routerser: Router,
    public ApputilsService: ApputilsService,
    public router: RouterHelper,
    public FormBuilder: FormBuilder,
    public nts: NotificationService,
    public auth: AuthService,
    private _coreSidebarService: CoreSidebarService,
    public fs: firebaseStoreService){
      
    }
  ngOnInit() {
    this.form = this.FormBuilder.group({
      oldpassword:[null,[Validators.required]],
      password:[null,[Validators.required]],
      confirmpassword:[null,Validators.required]
    })
    
  }
  
  onSubmit()
  {
    this.isSubmit = true;
    if(this.form.valid)
    {
        var password = this.form.controls["oldpassword"].value;
        var newpassword = this.form.controls["password"].value;
        var confirmnewpassword = this.form.controls["confirmpassword"].value;
        if(newpassword != confirmnewpassword)
        {
          this.nts.showError("New Password not equal to confirm password","Password Error");
        }
        else{
          this.auth.changepassword(password,newpassword).then(e=>{
            if(e)
            {

            }
          }).catch(e=>{
            console.log(e);
            this.error = e.message;
          });
        }
    }
  }
}
