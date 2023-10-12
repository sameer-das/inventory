import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { NewPurchasePopupComponent } from 'src/app/popups/new-purchase-popup/new-purchase-popup.component';


@Component({
  selector: 'app-new-purchase',
  templateUrl: './new-purchase.component.html',
  styleUrls: ['./new-purchase.component.scss']
})
export class NewPurchaseComponent implements OnInit {


  constructor(private _matdialog: MatDialog) { }

  purchasedItems: any[] = [];

  totalGst: number = 0.00;
  totalDiscount: number = 0.00;
  totalAmount: number = 0.00;

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
      data: {isEdit: false, item},
    }).afterClosed().subscribe((data: any) => {
      if (data.shouldAdd) {
        // console.log(data.item);
        this.purchasedItems.push(data.item);
        this.calculateTotal();
      }
    })
  }

  calculateTotal() {
    if (this.purchasedItems.length === 0) {
      this.totalGst = 0.00;
      this.totalDiscount = 0.00;
      this.totalAmount = 0.00;
    } else if (this.purchasedItems.length > 0) {
      this.totalGst = 0.00;
      this.totalDiscount = 0.00;
      this.totalAmount = 0.00;

      this.purchasedItems.forEach((item) => {
        this.totalAmount += +item.totalPrice;
        this.totalGst += +item.taxAmount;
        this.totalDiscount += +item.discountPrice;
      })
    }
  }

  @ViewChild(MatMenuTrigger) contextMenu!: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };
  onContextMenu(e: MouseEvent, item: any, i: number) {
    e.preventDefault();
    console.log(item)
    this.contextMenuPosition.x = e.clientX + 'px';
    this.contextMenuPosition.y = e.clientY + 'px';
    this.contextMenu.menuData = { 'item': item , i: i};
    // this.contextMenu.menu.focusFirstItem('mouse');
    this.contextMenu.openMenu();
  }

  onEdit(item: any, i: number) {
    // console.log(item, i);
    this._matdialog.open(NewPurchasePopupComponent, {
      minWidth: '85vw',
      height: '95vh',
      disableClose: true,
      panelClass: 'new-purchase-popup',
      data: {isEdit: true, item},
    }).afterClosed().subscribe((editData:any) => {
      if(editData.isEdit) {
        this.purchasedItems[i] = editData.item;
        this.calculateTotal();
      }
    })
  }

  onDelete(item: any, i: number) {
    console.log(item);
    this.purchasedItems.splice(i, 1);
    this.calculateTotal();
  }

}
