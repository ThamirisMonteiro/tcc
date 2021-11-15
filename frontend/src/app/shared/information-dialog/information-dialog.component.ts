import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './information-dialog.component.html',
  styleUrls: ['./information-dialog.component.css']
})

export class ConfirmationDialogComponent {

  @Input() title?: string;
  @Input() message?: string;
  @Input() btnOkText?: string;

  constructor(private activeModal: NgbActiveModal) { }

  public accept() {
    this.activeModal.close(true);
  }

  public dismiss() {
    this.activeModal.dismiss();
  }
}
