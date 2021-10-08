import { ActivatedRoute } from '@angular/router';
import { Injectable } from '@angular/core';
@Injectable({
    providedIn: 'root'
  })
export class RouterHelper{
    constructor(public route:ActivatedRoute)
    {

    }
    getValueFromUrl(key:string)
    {
        debugger;
        return this.route.snapshot.paramMap.get(key);
    }
}