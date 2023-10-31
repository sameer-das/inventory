import { Component, OnInit, OnDestroy } from '@angular/core';
import { SaleService } from '../sale.service';
import { LoaderService } from 'src/app/services/loader.service';
import { Subject, finalize, takeUntil } from 'rxjs';
import { APIResponse } from 'src/app/apiresponse';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-sales',
  templateUrl: './list-sales.component.html',
  styleUrls: ['./list-sales.component.scss']
})
export class ListSalesComponent implements OnInit, OnDestroy {
  constructor(private _saleService: SaleService, private _loaderService: LoaderService,
    private _router: Router) { }

  private destroy$: Subject<boolean> = new Subject<boolean>();

  sales: any[] = [];

  ngOnInit(): void {
    this.getAllSales()
  }
  ngOnDestroy(): void {
    this.destroy$.next(true)
  }

  getAllSales() {
    this._loaderService.showLoader();
    this._saleService.getAllSales()
      .pipe(takeUntil(this.destroy$), finalize(() => this._loaderService.hideLoader()))
      .subscribe({
        next: (resp: APIResponse) => {
          console.log(resp)
          if (resp.status === 200) {
            this.sales = resp.result;
          }
        },
        error: (err) => {
          console.log('Error while fetching all sales')
          console.log(err)
        }
      })
  }

  onSaleSelect(sale_uid: string) {
    console.log(sale_uid);
    this._router.navigate([`sale/sale-details/${sale_uid}`]);
  }

}
