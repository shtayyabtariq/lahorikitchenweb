import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import firebase from 'firebase';
import { first } from 'rxjs/operators';
import { firebaseStoreService } from './firebasestoreservice';
import { debug } from 'console';
@Injectable({
    providedIn: 'root'
  })
  export class AuthService {
    constructor(public auth: AngularFireAuth,public fs:firebaseStoreService) {
      this.auth.authState.subscribe((user) => {
        if (user) {
          localStorage.setItem("uid", user.uid);
          localStorage.setItem("user", user.email);
          
          debugger;
          this.fs.getUserById(user.uid).valueChanges().subscribe(e=>{
           debugger;
           if(e != null)
           {
            localStorage.setItem("role",e.role);
            localStorage.setItem("name",e.name);
           }

          });
        } else {
          localStorage.removeItem("user");
          localStorage.removeItem("uid");
          localStorage.removeItem("role");
        }
      });
    }
    async getUID() {
      var user = await this.auth.authState.pipe(first()).toPromise();
      return user != null ? user.uid : null;
    }
    getname(){
        return localStorage.getItem("name");
    }
    getemail(){
        return localStorage.getItem("user");
    }
    isAdmin() {
      debugger;
      // await this.auth.authState.pipe(first()).toPromise();
      return (
        localStorage.getItem("role") != null &&
        localStorage.getItem("role") == "Admin"
      );
    }
    getRole()
    {
        return localStorage.getItem("role");
    }
    loginByEmailPassword(email: string, password: string) {
      return this.auth.signInWithEmailAndPassword(email, password);
    }
    createUserByEmailPassword(email: string, password: string) {
      return this.auth.createUserWithEmailAndPassword(email, password);
    }
    logout() {
      return this.auth.signOut();
    }
    forgotpassword(email: string) {
      return this.auth.sendPasswordResetEmail(email);
    }
    async changepassword(oldpassword: string, newpassword: string) {
      var user = await this.auth.authState.pipe(first()).toPromise();
      var credential = firebase.auth.EmailAuthProvider.credential(
        user.email,
        oldpassword
      );
      var response = await (await this.auth.currentUser)
        .reauthenticateWithCredential(credential)
        
      if (response.user != null) {
        var newresponse = await user.updatePassword(newpassword).then();
        return true;
      } else {
        return false;
      }
    }
  }
  