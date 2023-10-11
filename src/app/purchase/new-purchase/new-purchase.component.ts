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

  purchasedIetms: any[] = [{
    "mrp": "65",
    "quantityBox": "40",
    "piecePerCarton": "20",
    "quantityPiece": "0",
    "quantityFree": "0",
    "purchasePriceBeforeDiscount": "37904.00",
    "discountPrice": "454.85",
    "purchasePriceAfterDiscount": "37449.15",
    "gst": "18",
    "totalQuantityPiece": 800,
    "taxAmount": "6740.85",
    "totalPrice": "44190.00",
    "purchasePricePerPiece": "55.24",
    "item_name": "Kitkat Rs.20",
}]
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
        this.purchasedIetms.push(data.item);
      }
    })
  }

}
