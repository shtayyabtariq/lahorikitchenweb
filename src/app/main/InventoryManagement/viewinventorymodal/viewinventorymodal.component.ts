import { Component, OnInit } from '@angular/core';
import { Apartmentdto } from '../../../auth/models/apartmentdto';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-viewinventorymodal',
  templateUrl: './viewinventorymodal.component.html',
  styleUrls: ['./viewinventorymodal.component.scss']
})
export class ViewinventorymodalComponent implements OnInit {


  ap:Apartmentdto[]=[]
  constructor(
    public modal:NgbActiveModal
  ) {
    
  }
  ngOnInit(): void {
    
  }

  

}
