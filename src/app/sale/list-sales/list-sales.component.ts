import { Component, OnInit, OnDestroy } from '@angular/core';
import { SaleService } from '../sale.service';
import { LoaderService } from 'src/app/services/loader.service';
import { Subject, finalize, takeUntil } from 'rxjs';
import { APIResponse } from 'src/app/apiresponse';
import { ActivatedRoute, Router } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-list-sales',
  templateUrl: './list-sales.component.html',
  styleUrls: ['./list-sales.component.scss']
})
export class ListSalesComponent implements OnInit, OnDestroy {
  constructor(private _saleService: SaleService, private _loaderService: LoaderService,
    private _router: Router, private route: ActivatedRoute) { }

  private destroy$: Subject<boolean> = new Subject<boolean>();

  totalPage= 0;
  pageSize = 15;
  pageNo = 1;

  sales: any[] = [];

  ngOnInit(): void {
    // this.getAllSales()
    this.route.queryParams.subscribe({
      next: (queryParams: any) => {
        // console.log(queryParams)
        this.getAllSales(queryParams.pageno || this.pageNo, queryParams.pagesize || this.pageSize)
      }
    })
  }
  ngOnDestroy(): void {
    this.destroy$.next(true)
  }

  getAllSales(pageNo: number, pageSize: number) {
    this._loaderService.showLoader();
    this._saleService.getAllSales(pageNo, pageSize)
      .pipe(takeUntil(this.destroy$), finalize(() => this._loaderService.hideLoader()))
      .subscribe({
        next: (resp: APIResponse) => {
          console.log(resp)
          if (resp.status === 200) {
            this.sales = resp.result;
            this.totalPage = resp.result[0]['total_count'];
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

  handlePageEvent (e: PageEvent) {
    console.log(e)
    this._router.navigate(['/sale/list-sales'], {queryParams: {pageno: e.pageIndex + 1, pagesize: e.pageSize}})

  }
}
