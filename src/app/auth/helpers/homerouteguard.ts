import { Injectable } from "@angular/core";
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { AuthenticationService } from "../service";
import { AuthService } from "../service/authservice";
import { ApputilsService } from './apputils.service';
import { first } from 'rxjs/operators';


    @Injectable({ providedIn: 'root' })
export class HomeRouteAuthGuard implements CanActivate {
  /**
   *
   * @param {Router} _router
   * @param {AuthenticationService} _authenticationService
   */
  constructor(public ApputilsService:ApputilsService,public auth:AuthService, private _router: Router, private _authenticationService: AuthenticationService) {}

  // canActivate
  async canActivate( route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    
    
   
    const currentUser = this._authenticationService.currentUserValue;
    debugger;
    if (currentUser) {
        await this.auth.auth.authState.pipe(first()).toPromise();
      // // check if route is restricted by role
      // if (route.data.roles && route.data.roles.indexOf(currentUser.role) === -1) {
      //   // role not authorised so redirect to not-authorized page
      //   this._router.navigate(['/pages/miscellaneous/not-authorized']);
      //   return false;
      // }

      // authorised so return true
    var authstate =  await this.auth.auth.currentUser;
    debugger;
    if(authstate != undefined && authstate.uid != undefined)
    {
        debugger;
      var role = this.auth.getRole();
      if(role == this.ApputilsService.AdminRole)
      {
          this._router.navigateByUrl("/users");
          return false;
      }
    }
      return true;
    }
    return false;

    
  }
}
