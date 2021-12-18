import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { AuthenticationService } from 'app/auth/service';
import { first } from 'rxjs/operators';
import { AuthService } from '../service/authservice';
import { debug } from 'console';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  /**
   *
   * @param {Router} _router
   * @param {AuthenticationService} _authenticationService
   */
  constructor(public auth:AuthService, private _router: Router, private _authenticationService: AuthenticationService) {}

  // canActivate
  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    
    
   debugger;
    var auth = await this.auth.auth.authState.pipe(first()).toPromise();
    if(auth == undefined)
    {
      this._router.navigate(['/pages/authentication/login-v2'], { queryParams: { returnUrl: state.url } });
    }
    return auth != undefined;
    const currentUser = this._authenticationService.currentUserValue;
    debugger;
    if (currentUser) {
      // // check if route is restricted by role
      // if (route.data.roles && route.data.roles.indexOf(currentUser.role) === -1) {
      //   // role not authorised so redirect to not-authorized page
      //   this._router.navigate(['/pages/miscellaneous/not-authorized']);
      //   return false;
      // }

      // authorised so return true
      return true;
    }

    // not logged in so redirect to login page with the return url
    this._router.navigate(['/pages/authentication/login-v2'], { queryParams: { returnUrl: state.url } });
    return false;
  }
}
