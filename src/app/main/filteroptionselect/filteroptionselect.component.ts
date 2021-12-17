import { Component, OnInit } from '@angular/core';
import { firebaseStoreService } from 'app/auth/service/firebasestoreservice';
import { ApputilsService } from '../../auth/helpers/apputils.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FlatpickrOptions } from 'ng2-flatpickr';
import { daterangepickerdto } from '../../auth/models/daterangepickerdto';

@Component({
  selector: 'app-filteroptionselect',
  templateUrl: './filteroptionselect.component.html',
  styleUrls: ['./filteroptionselect.component.scss']
})
export class FilteroptionselectComponent implements OnInit {
  showdaterange: boolean = false;
  drp:daterangepickerdto;
  public DateRangeOptions: FlatpickrOptions = {
    altInput: true,
    mode: 'range',
    onChange:(selectedates:any)=>{
      console.log(selectedates);
      if(selectedates.length > 1)
      {
        this.drp = new daterangepickerdto();
        this.drp.startdate = selectedates[0];
        this.drp.enddate = selectedates[1];
        this.drp.option = this.drp.startdate.getDate()+"/"+this.drp.startdate.getMonth()+"/"+this.drp.startdate.getFullYear()+"-"+this.drp.enddate.getDate()+"/"+this.drp.enddate.getMonth()+"/"+this.drp.enddate.getFullYear();
        
      }
    }
  }
  constructor( public fs: firebaseStoreService,
    public route: ActivatedRoute,
    public routerser: Router,
    public modal: NgbActiveModal,
    public modalservice: NgbModal,
    public ApputilsService: ApputilsService) { }

  ngOnInit() {
    this.drp = this.ApputilsService.getMonthRange();
  }
  rangeselect(range: string) {
    debugger;
    this.showdaterange = false;
    
    if (range == this.ApputilsService.ReportThisMonth) {
      this.drp = this.ApputilsService.getMonthRange();
      this.drp.option = "Month"
     
    } else if (range == this.ApputilsService.ReportThisYear) {
      this.drp = this.ApputilsService.getYearRange();
      this.drp.option = "Year";
     
    } else if (range == this.ApputilsService.ReportCustom) {
      this.showdaterange = true;
      this.drp.option = "Custom";
    } else {
      this.drp.startdate = new Date();
      this.drp.option = "All";
    }
  }
  onSubmit()
  {
    this.modal.close(this.drp);
  }

}
