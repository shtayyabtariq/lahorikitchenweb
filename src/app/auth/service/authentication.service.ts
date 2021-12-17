import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from 'environments/environment';
import { User, Role } from 'app/auth/models';
import { ToastrService } from 'ngx-toastr';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  //public
  public currentUser: Observable<String>;

  //private
  private currentUserSubject: String;

  /**
   *
   * @param {HttpClient} _http
   * @param {ToastrService} _toastrService
   */
  constructor(private _http: HttpClient,  public auth:AngularFireAuth,private _toastrService: ToastrService) {
    this.currentUserSubject = localStorage.getItem('currentUser');
    
   
  }

  // getter: currentUserValue
  public get currentUserValue(): String {
    return this.currentUserSubject;
  }

  // /**
  //  *  Confirms if user is admin
  //  */
  // get isAdmin() {
  //   return this.currentUser && this.currentUserSubject.value.role === Role.Admin;
  // }

  // /**
  //  *  Confirms if user is client
  //  */
  // get isClient() {
  //   return this.currentUser && this.currentUserSubject.value.role === Role.Client;
  // }

  /**
   * User login
   *
   * @param email
   * @param password
   * @returns user
   */
  async login(email: string, password: string) {
   var resp = await this.auth.signInWithEmailAndPassword(email,password)
      .then();
      debugger;
      if(resp != null)
      {
       
        localStorage.setItem('currentUser', resp.user.uid);
        // Display welcome toast!
        setTimeout(() => {
          this._toastrService.success(
            'You have successfully logged in as an ' +
              "Tayyab" +
              ' user to Vuexy. Now you can start to explore. Enjoy! 🎉',
            '👋 Welcome, ' + "FS" + '!',
            { toastClass: 'toast ngx-toastr', closeButton: true }
          );
        }, 2500);
      }
    }
       
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            

            

           

  /**
   * User logout
   *
   */
  async logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    localStorage.removeItem('role');
    await this.auth.signOut();
   
    // // notify
    // this.currentUserSubject.next(null);
  }
}