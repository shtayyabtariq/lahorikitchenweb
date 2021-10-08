import { Component, Inject, OnInit } from '@angular/core';
import { NotificationService } from '../../auth/service/notification.service';
import { firebaseStoreService } from '../../auth/service/firebasestoreservice';
import { apartmenttypes } from '../../auth/models/apartmenttypesdto';
import { ColumnMode } from '@swimlane/ngx-datatable';
import Swal from 'sweetalert2';
import { swalProviderToken } from '@sweetalert2/ngx-sweetalert2/lib/di';
import { Title } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
doc:Document;
  constructor(@Inject(DOCUMENT) document,public nts:NotificationService,public fs:firebaseStoreService) { }
  public ColumnMode = ColumnMode;
  apt:apartmenttypes[] = [];
  ngOnInit() {
    this.fs.getapartmenttypes().valueChanges().subscribe(e=>{

      this.apt = e;
    });

  }
  deleteType(id:any)
  {
    Swal.fire({
      title:'Are You Sure You Want To Delete ?',
      allowOutsideClick:false,
      allowEnterKey:false,
      allowEscapeKey:false,
      cancelButtonText:'Cancel',
      confirmButtonText:'Delete',
      showCancelButton:true,
    }).then(e=>{
      if(e.isConfirmed)
      {
        this.fs.deleteapartmenttype(id).then(e=>{});
      }
    });
   
  }
  async AddNew()
{

  const { value: formValues } = await Swal.fire({
    title: 'Apartment Types',
    
    html:
      '<input id="swal-input1" class="swal2-input" placeholder="Apartment Type" type="text">' +
      '<input id="swal-input2" class="swal2-input" placeholder="Order No" type="Number">'+
      '<input id="swal-input3" class="swal2-input" placeholder="Name Format" type="text">'+
      '<input id="swal-input4" class="swal2-input" placeholder="No Of Floors Occupied" type="number">',
    focusConfirm: false,
    backdrop:false,
    showCancelButton:true,
    cancelButtonText:'Cancel',
    confirmButtonText:'Add',
    preConfirm: () => {
      return [
       (<HTMLInputElement> document.getElementById('swal-input1')).value,
       (<HTMLInputElement> document.getElementById('swal-input2')).value,
       (<HTMLInputElement> document.getElementById('swal-input3')).value,
       (<HTMLInputElement> document.getElementById('swal-input4')).value
      ]
    }
  })
  debugger;
  if (formValues) {
    var name = formValues[0];
    var ordernumber = formValues[1];
    var format = formValues[2];
    var floors = formValues[3];
        let apt : apartmenttypes = {
          id: '',
          orderno: Number.parseInt(ordernumber),
          name: name,
          nameformat: format,
          floorcount: Number.parseInt(floors)
        }
      this.fs.addapartmenttypes(apt).then(e=>{
        this.nts.showSuccess("Added Successfully","Added");
      });
  }





  // Swal.fire({
  //  title:'Enter Apartment Type', 
  // input:'text',
  
  // cancelButtonText:'Cancel',
  // confirmButtonText:'Add',
  // showCancelButton:true,
  // allowOutsideClick:false,
  // inputPlaceholder:'Apartment Name',
  // inputValidator:result=> result.length < 1 && 'Input Can not Be Empty'



  // }).then(e =>{
    
  //   if(e.isConfirmed)
  //   {
  //     let apt : apartmenttypes = {
  //       id: '',
  //       orderno:0,
  //       name: e.value as string
  //     }
  //     this.fs.addapartmenttypes(apt).then(e=>{
  //       this.nts.showSuccess("Added Successfully","Added");
  //     });
  //   }
  // });
}


}
