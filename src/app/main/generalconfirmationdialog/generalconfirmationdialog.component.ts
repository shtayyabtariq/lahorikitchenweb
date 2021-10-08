import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { GeneralConfirmationDialogDto } from '../../auth/models/generalconfirmationdialogdto';

@Component({
  selector: 'app-generalconfirmationdialog',
  templateUrl: './generalconfirmationdialog.component.html',
  styleUrls: ['./generalconfirmationdialog.component.scss']
})
export class GeneralconfirmationdialogComponent implements OnInit {

  public dto:GeneralConfirmationDialogDto;
  constructor(public modal:NgbActiveModal) { }

  ngOnInit() {
  }

  onSubmit()
  {

    this.modal.close(true);
  }
}
