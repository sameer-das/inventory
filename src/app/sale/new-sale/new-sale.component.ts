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

  saleItems:any[] = [];

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
      data: { isEdit: false, item: {
        "item_name": "Munch Rs.10",
        "category_name": "Chocolates",
        "brand_name": "Nestle",
        "uid": "991d19ca-1b0c-441b-8e63-ee3e9c1f8f33",
        "item_id": 7,
        "category_id": 1,
        "brand_id": 1,
        "mrp":50,
        "stock": [
          {
            "item_id": 7,
            "category_id": 1,
            "brand_id": 1,
            "item_name": "Munch Rs.10",
            "category_name": "Chocolates",
            "brand_name": "Nestle",
            "total_quantity": 800,
            "barcode": null,
            "purchase_id": 13,
            "uid": "991d19ca-1b0c-441b-8e63-ee3e9c1f8f33",
            "mrp": "10.00",
            "total_quantity_piece": 400,
            "piece_per_carton": 20,
            "purchase_price_per_piece": "7.88",
            "gst": 5,
            "purchase_date": "2023-10-16T18:30:00.000Z"
          },
          {
            "item_id": 7,
            "category_id": 1,
            "brand_id": 1,
            "item_name": "Munch Rs.10",
            "category_name": "Chocolates",
            "brand_name": "Nestle",
            "total_quantity": 800,
            "barcode": null,
            "purchase_id": 16,
            "uid": "16005751-6fd6-48fe-b2de-bf59f4eeb789",
            "mrp": "10.00",
            "total_quantity_piece": 400,
            "piece_per_carton": 20,
            "purchase_price_per_piece": "8.14",
            "gst": 5,
            "purchase_date": "2023-10-15T18:30:00.000Z"
          }
        ]
    }}
    
    }).afterClosed().subscribe((data: any) => {
      console.log(data);
      if(data.isAdd) {
        this.saleItems.push(data.item)
      }
    })
  }

}
