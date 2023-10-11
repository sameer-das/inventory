import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NewPurchasePopupComponent } from 'src/app/popups/new-purchase-popup/new-purchase-popup.component';


@Component({
  selector: 'app-new-purchase',
  templateUrl: './new-purchase.component.html',
  styleUrls: ['./new-purchase.component.scss']
})
export class NewPurchaseComponent implements OnInit {


  constructor(private _matdialog: MatDialog) { }

  item = {
    "category_id": 1,
    "brand_id": 1,
    "item_name": "Kitkat Rs.20",
    "total_quantity": 0,
    "barcode": "12536459897556",
    "status": 1
  }

  ngOnInit() {

  }

  onItemSelection(item: any) {
    this._matdialog.open(NewPurchasePopupComponent, {
      minWidth: '85vw',
      height: '95vh',
      disableClose: true,
      panelClass: 'new-purchase-popup',
      data: item,
    }).afterClosed().subscribe((data: any) => {
      if (data.shouldAdd) {
        console.log(data.item);
      }
    })
  }

}
