import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { NewSalePopupComponent } from 'src/app/popups/new-sale-popup/new-sale-popup.component';

@Component({
  selector: 'app-new-sale',
  templateUrl: './new-sale.component.html',
  styleUrls: ['./new-sale.component.scss']
})
export class NewSaleComponent implements  OnInit, OnDestroy{
 
  constructor(private _matdialog: MatDialog){}
  private destroy$: Subject<boolean> = new Subject<boolean>();

  saleDate: string = '';
  customerName: string = '';
  customerGSTN: string = '';
  today: Date = new Date();


  arr: number[] = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25]

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
      // data: { isEdit: false, item },
    }).afterClosed().subscribe((data: any) => {
      if (data.shouldAdd) {
        // console.log(data.item);
        // this.purchasedItems.push(data.item);
        // this.calculateTotal();
        // this.clearSearch()
      }
    })
  }

}
