import { Component, OnDestroy, OnInit } from '@angular/core';
import { StockService } from '../stock.service';
import { Subject, finalize, takeUntil } from 'rxjs';
import { LoaderService } from 'src/app/loader.service';
import { APIResponse } from 'src/app/apiresponse';
import { MatDialog } from '@angular/material/dialog';
import { ItemStockDetailsComponent } from 'src/app/popups/item-stock-details/item-stock-details.component';

@Component({
  selector: 'app-list-stock',
  templateUrl: './list-stock.component.html',
  styleUrls: ['./list-stock.component.scss']
})
export class ListStockComponent implements OnInit, OnDestroy {
  constructor(private _stockService: StockService, private _loaderService: LoaderService,
    private _dialog: MatDialog) { }

  private destroy$: Subject<boolean> = new Subject<boolean>();
  items: any[] = [];
  ngOnInit(): void {
    this.getAllItems()
  }
  ngOnDestroy(): void {
    this.destroy$.next(true);
  }

  getAllItems() {
    this._loaderService.showLoader();
    this._stockService.getItems()
      .pipe(takeUntil(this.destroy$), finalize(() => this._loaderService.hideLoader()))
      .subscribe({
        next: (resp: APIResponse) => {
          console.log(resp)
          if (resp.status === 200) {
            this.items = resp.result;
          }
        },
        error: (err) => {
          console.log('Error while fetching all items')
          console.log(err)
        }
      })
  }

  onItemClick(item_id: number) {
    this._dialog.open(ItemStockDetailsComponent, {
      minWidth: '70vw',
      height: '60vh',
      panelClass: 'item-stock-details',
      data: item_id
    })
  }

}
