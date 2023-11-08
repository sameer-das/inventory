import { Component, OnDestroy, OnInit } from '@angular/core';
import { StockService } from '../stock.service';
import { Subject, finalize, takeUntil } from 'rxjs';
import { LoaderService } from 'src/app/services/loader.service';
import { APIResponse } from 'src/app/apiresponse';
import { MatDialog } from '@angular/material/dialog';
import { ItemStockDetailsComponent } from 'src/app/popups/item-stock-details/item-stock-details.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-stock',
  templateUrl: './list-stock.component.html',
  styleUrls: ['./list-stock.component.scss']
})
export class ListStockComponent implements OnInit, OnDestroy {
  constructor(private _stockService: StockService, private _loaderService: LoaderService,
    private _dialog: MatDialog, private _router: Router) { }

  private destroy$: Subject<boolean> = new Subject<boolean>();
  stocks: any[] = [];
  ngOnInit(): void {
    // this.getAllItems()
    this.getStocksWorthBrandWise();
  }
  ngOnDestroy(): void {
    this.destroy$.next(true);
  }

  // getAllItems() {
  //   this._loaderService.showLoader();
  //   this._stockService.getItems()
  //     .pipe(takeUntil(this.destroy$), finalize(() => this._loaderService.hideLoader()))
  //     .subscribe({
  //       next: (resp: APIResponse) => {
  //         console.log(resp)
  //         if (resp.status === 200) {
  //           this.items = resp.result;
  //         }
  //       },
  //       error: (err) => {
  //         console.log('Error while fetching all items')
  //         console.log(err)
  //       }
  //     })
  // }

  getStocksWorthBrandWise() {
    this._loaderService.showLoader();
    this._stockService.getStockWorthBrandWise()
      .pipe(takeUntil(this.destroy$), finalize(() => this._loaderService.hideLoader()))
      .subscribe({
        next: (resp: APIResponse) => {
          console.log(resp)
          if (resp.status === 200) {
            this.stocks = resp.result;

            if (this.stocks.length > 0)
              this.calculateTotal()

          }
        },
        error: (err) => {
          console.log('Error while fetching stocks')
          console.log(err)
        }
      })
  }

  onStockClick(brandId: number) {
    this._router.navigate([`stock/brand/${brandId}`])
  }

  total: number = 0;
  calculateTotal() {
    this.stocks.forEach(stock => {
      this.total = +(this.total + +stock.total_stock).toFixed(2);
    })
  }

}
