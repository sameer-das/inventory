import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { NewSalePopupComponent } from 'src/app/popups/new-sale-popup/new-sale-popup.component';
import { SaleService } from '../sale.service';
import { PopupService } from 'src/app/popups/popup.service';


@Component({
  selector: 'app-new-sale',
  templateUrl: './new-sale.component.html',
  styleUrls: ['./new-sale.component.scss']
})
export class NewSaleComponent implements OnInit, OnDestroy {

  constructor(private _matdialog: MatDialog, private _saleService: SaleService, private _popupService: PopupService) { }
  private destroy$: Subject<boolean> = new Subject<boolean>();

  saleDate: string = '';
  customerName: string = '';
  customerGSTN: string = '';
  today: Date = new Date();

  saleItems: any[] = [];

  totalSaleAmount: number = 0;


  ngOnInit(): void {
    // throw new Error('Method not implemented.');
  }
  ngOnDestroy(): void {
    // throw new Error('Method not implemented.');
  }

  onItemSelection(item?: any) {
    this._matdialog.open(NewSalePopupComponent, {
      minWidth: '85vw',
      height: '95vh',
      disableClose: true,
      panelClass: 'new-sale-popup',
      data: { isEdit: false, item: item }

    }).afterClosed().subscribe((data: any) => {
      console.log(data);
      if (!data.isEdit) {
        this.saleItems.push(data.item);
        this.calculateSummary();
      }
    })
  }

  calculateSummary() {
    this.totalSaleAmount = 0;
    this.saleItems.forEach((item: any) => {
      this.totalSaleAmount += item.totalAmount;
    })
  }


  onSubmit() {
    console.log(this.saleItems);
    if (this.saleItems.length === 0) {
      this._popupService.openAlert({
        header: 'Alert',
        message: 'Please add items.'
      })
      return;
    }
    if (!this.saleDate) {
      this._popupService.openAlert({
        header: 'Alert',
        message: 'Please choose sale/bill date.'
      })
      return;
    }
    const sale = {
      customerGSTN: this.customerGSTN,
      customerName: this.customerName,
      saleDate: new Date(this.saleDate)
        .toLocaleDateString().split('/').reverse().join('-'),
      saleItems: this.saleItems
    }
    this._saleService.saveSale(sale).subscribe({
      next: (data) => {
        console.log(data)
      }
    })
  }

  onDoubleClick(item: any, i: number) {
    console.log(i)
    console.log(item);
    this._matdialog.open(NewSalePopupComponent, {
      minWidth: '85vw',
      height: '95vh',
      disableClose: true,
      panelClass: 'new-sale-popup',
      data: { isEdit: true, item: item }

    }).afterClosed().subscribe((data: any) => {
      console.log(data);

      if (data.isEdit) {
        this.saleItems[i] = data.item;
        this.calculateSummary()
      }

    })
  }

}
