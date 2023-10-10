import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-new-purchase-popup',
  templateUrl: './new-purchase-popup.component.html',
  styleUrls: ['./new-purchase-popup.component.scss']
})
export class NewPurchasePopupComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public item: any){}
}
