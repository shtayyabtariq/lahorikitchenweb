import { Injectable } from "@angular/core";
import { AngularFireFunctions } from "@angular/fire/functions";
import { User } from '../models/user';

@Injectable({
    providedIn: "root",
  })
export class firefunctionsservice{

    constructor(public af:AngularFireFunctions)
    {

    }

    createUser(usr:User)
    {
        debugger;
       var createUsr =  this.af.httpsCallable("createUser");
       return createUsr({
           "email":usr.email,
           "password":"123456",
           "name":usr.name,
           "role":usr.role
       });
    }

}