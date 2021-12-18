import { Injectable } from "@angular/core";
import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from "@angular/router";
import { first } from "rxjs/operators";
import { AuthenticationService } from "../service";
import { AuthService } from "../service/authservice";
import { ApputilsService } from "../helpers/apputils.service";

@Injectable({ providedIn: "root" })
export class ManagerRouteAuthGuard implements CanActivate {
  /**
   *
   * @param {Router} _router
   * @param {AuthenticationService} _authenticationService
   */
  constructor(
    public ApputilsService: ApputilsService,
    public auth: AuthService,
    private _router: Router,
    private _authenticationService: AuthenticationService
  ) {}

  // canActivate
  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const currentUser = this._authenticationService.currentUserValue;
    if (currentUser) {
    await this.auth.auth.authState.pipe(first()).toPromise();
      var authstate = await this.auth.auth.currentUser;
      if (authstate.uid != undefined) {
        var role = this.auth.getRole();
        if (
          role == this.ApputilsService.ManagerRole 
        ) {
          return true;
        }
      }
      this._router.navigateByUrl("/");
      return false;
    }
    this._router.navigateByUrl("/");
    return false;
  }
}
