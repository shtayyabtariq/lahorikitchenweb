import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-progressdialog',
  templateUrl: './progressdialog.component.html',
  styleUrls: ['./progressdialog.component.scss']
})
export class ProgressdialogComponent implements OnInit {

  constructor(public modal:NgbActiveModal) { }

  ngOnInit() {
  }

}
