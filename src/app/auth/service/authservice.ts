import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
@Injectable({
    providedIn: 'root'
  })
export class AuthService{

    constructor(public auth:AngularFireAuth)
    {
        this.auth.authState.subscribe(user=>{

            if(user)
            {
                localStorage.setItem("user",user.email);
            }
            else{
                localStorage.removeItem("user");
            }
        });
    }

    
    loginByEmailPassword(email:string,password:string)
    {
        return this.auth.signInWithEmailAndPassword(email,password);
    }
    createUserByEmailPassword(email:string,password:string)
    {
        return this.auth.createUserWithEmailAndPassword(email,password);
    }
    logout()
    {
        return this.auth.signOut();
    }
    forgotpassword(email:string)
    {
        return this.auth.sendPasswordResetEmail(email);
    }

}