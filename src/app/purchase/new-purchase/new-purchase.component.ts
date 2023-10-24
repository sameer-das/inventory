import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { Subject, takeUntil } from 'rxjs';
import { LoaderService } from 'src/app/loader.service';
import { NewPurchasePopupComponent } from 'src/app/popups/new-purchase-popup/new-purchase-popup.component';
import { PopupService } from 'src/app/popups/popup.service';
import { SearchItemService } from 'src/app/search-item/search-item.service';
import { PurchaseService } from '../purchase.service';


@Component({
  selector: 'app-new-purchase',
  templateUrl: './new-purchase.component.html',
  styleUrls: ['./new-purchase.component.scss']
})
export class NewPurchaseComponent implements OnInit, OnDestroy {


  constructor(private _matdialog: MatDialog,
    private _purchaseService: PurchaseService,
    private _searchItemService: SearchItemService,
    private _loaderService: LoaderService,
    private _popupService: PopupService) { }

  arr = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]
  today: Date = new Date();
  private destroy$: Subject<boolean> = new Subject<boolean>();

  purchasedItems: any[] = [];

  totalGst: number = 0.00;
  totalDiscount: number = 0.00;
  totalAmount: number = 0.00;


  purchaseDate: string = '';
  billerName: string = '';
  billerGSTN: string = '';

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
      data: { isEdit: false, item },
    }).afterClosed().subscribe((data: any) => {
      if (data.shouldAdd) {
        // console.log(data.item);
        this.purchasedItems.push(data.item);
        this.calculateTotal();
        this.clearSearch()
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
    this.contextMenu.menuData = { 'item': item, i: i };
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
      data: { isEdit: true, item },
    }).afterClosed().subscribe((editData: any) => {
      if (editData.isEdit) {
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


  onSaveBill() {
    // console.log(this.purchasedItems);
    if(this.purchasedItems.length === 0) {
      this._popupService.openAlert({
        header:'Alert',
        message:'Please add items.'
      })
      return;
    }
    if (!this.purchaseDate) {
      this._popupService.openAlert({
        header:'Alert',
        message:'Please choose purchase/bill date.'
      })
      return;
    }

    const pdate = new Date(this.purchaseDate)
      .toLocaleDateString().split('/').reverse().join('-')

    this.purchasedItems = this.purchasedItems.
      map(curr => {
        return {
          ...curr,
          purchase_date: pdate,
          biller_name: this.billerName,
          biller_gstn: this.billerGSTN
        }
      })



    // console.log(this.purchaseDate);
    // console.log(this.billerName);
    // console.log(this.billerGSTN);


    this._loaderService.showLoader();
    this._purchaseService.addPurchase(this.purchasedItems)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (resp) => {
          this._loaderService.hideLoader()
          if (resp.status === 200) {
            this._popupService.openAlert({
              header: 'Success',
              message: 'Purchase Added Successfully!'
            });
            this.clearBillData();
          } else {
            this._popupService.openAlert({
              header: 'Fail',
              message: 'Failed while adding purchase!'
            });
          }
        },
        error: (error: any) => {
          this._loaderService.hideLoader()
          this._popupService.openAlert({
            header: 'Error',
            message: 'Error while adding purchase!'
          });
        }
      })
  }

  onCancelBill() {

  }


  clearSearch() {
    this._searchItemService.clearItemSearch();
  }

  clearBillData() {
    this.billerGSTN = '';
    this.billerName = '';
    this.purchaseDate = '';
    this.totalGst = 0.00;
    this.totalDiscount = 0.00;
    this.totalAmount = 0.00;
    this.purchasedItems = [];
  }



  ngOnDestroy(): void {
    this.destroy$.next(true)
  }
}
