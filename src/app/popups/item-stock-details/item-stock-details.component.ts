import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject, finalize, takeUntil } from 'rxjs';
import { APIResponse } from 'src/app/apiresponse';
import { StockService } from 'src/app/stock/stock.service';

@Component({
  selector: 'app-item-stock-details',
  templateUrl: './item-stock-details.component.html',
  styleUrls: ['./item-stock-details.component.scss']
})
export class ItemStockDetailsComponent implements OnInit, OnDestroy {
  constructor(@Inject(MAT_DIALOG_DATA) public data: number, private _stockService: StockService) { }

  private destroy$: Subject<boolean> = new Subject<boolean>();
  showProgress: boolean = true;
  itemDetails: any[] = [];
  totalBoxQuantity = 0;
  totalPieceQuantity = 0;
  totalStockWorth = 0;

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }

  ngOnInit(): void {
    this.getItemStockDetails();
  }


  getItemStockDetails() {
    this._stockService.getItemStockDetails(this.data)
      .pipe(takeUntil(this.destroy$), finalize(() => this.showProgress = false))
      .subscribe({
        next: (resp: APIResponse) => {
          if (resp.status === 200) {
            this.itemDetails = resp.result;
            this.calculate();
          }
        },
        error: (err) => {
          console.log(err)
        }
      })
  }

  calculate() {
    this.itemDetails.forEach(curr => {
      this.totalPieceQuantity += curr.total_quantity_piece;
      const x = Math.floor(curr.total_quantity_piece / curr.piece_per_carton);
      this.totalBoxQuantity += x;
      this.totalStockWorth = +(this.totalStockWorth + +(curr.total_quantity_piece * curr.purchase_price_per_piece)).toFixed(2);
    })
  }

}
