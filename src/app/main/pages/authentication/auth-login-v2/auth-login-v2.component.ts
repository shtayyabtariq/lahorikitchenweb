import { Component, Inject, OnInit, ViewEncapsulation } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";
import { Router } from "@angular/router";
import { CoreConfigService } from "@core/services/config.service";
import { AuthService } from "../../../../auth/service/authservice";
import { firebaseStoreService } from '../../../../auth/service/firebasestoreservice';
import { DOCUMENT } from "@angular/common";

@Component({
  selector: "app-auth-login-v2",
  templateUrl: "./auth-login-v2.component.html",
  styleUrls: ["./auth-login-v2.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class AuthLoginV2Component implements OnInit {
  //  Public
  public coreConfig: any;
  public loginForm: FormGroup;
  public loading = false;
  public submitted = false;
 
  public returnUrl: string;
  public error = "";
  public passwordTextType: boolean;
  // Private
  private _unsubscribeAll: Subject<any>;

  /**
   * Constructor
   *
   * @param {CoreConfigService} _coreConfigService
   */
  constructor(
    private _coreConfigService: CoreConfigService,
    private _formBuilder: FormBuilder,
    private _route: ActivatedRoute,
    private _router: Router,
    public fs:firebaseStoreService,
    public AuthService: AuthService,
    @Inject(DOCUMENT) private document: Document
  ) {
    this._unsubscribeAll = new Subject();

    // Configure the layout
    this._coreConfigService.config = {
      layout: {
        navbar: {
          hidden: true,
        },
        menu: {
          hidden: true,
        },
        footer: {
          hidden: true,
        },
        customizer: false,
        enableLocalStorage: false,
      },
    };
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.loginForm.controls;
  }

  /**
   * Toggle password
   */
  togglePasswordTextType() {
    this.passwordTextType = !this.passwordTextType;
  }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }
    const email = this.loginForm.controls["email"].value;
    const password = this.loginForm.controls["password"].value;
    this.loading = true;
    this.AuthService.loginByEmailPassword(email, password)
      .then(async (e) => {
        // Login
        debugger;
      //  var currentUser = (await this.fs.getcurrentEmployee(e.user.uid).get().toPromise()).data();
        localStorage.setItem('currentUser', e.user.uid);
      var currentUser = await (await this.fs.getUserById(e.user.uid).get().toPromise()).data();
      if(currentUser != undefined)
      {
        localStorage.setItem('role',currentUser.role);
        localStorage.setItem('name',currentUser.name);
      } 

        
        setTimeout(() => {
          this.document.location.href="/";
        // redirect to home page
        }, 1000);
      })
      .catch((e) => {
        this.loading = false;
        this.error = e;
      });
  }

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    this.loginForm = this._formBuilder.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", Validators.required],
    });

    // get return url from route parameters or default to '/'
    this.returnUrl = this._route.snapshot.queryParams["returnUrl"] || "/";

    // Subscribe to config changes
    this._coreConfigService.config
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((config) => {
        this.coreConfig = config;
      });
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
