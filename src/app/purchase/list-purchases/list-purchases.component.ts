import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, finalize, takeUntil } from 'rxjs';
import { PurchaseService } from '../purchase.service';
import { LoaderService } from 'src/app/services/loader.service';
import { MatDialog } from '@angular/material/dialog';
import { APIResponse } from 'src/app/apiresponse';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-list-purchases',
  templateUrl: './list-purchases.component.html',
  styleUrls: ['./list-purchases.component.scss']
})
export class ListPurchasesComponent implements OnInit, OnDestroy {
  constructor(private _purchaseService: PurchaseService, private _loaderService: LoaderService,
    private _dialog: MatDialog, private _router: Router,
    private route:ActivatedRoute) { }

  private destroy$: Subject<boolean> = new Subject<boolean>();

  pageSize = 15;
  total = 0;
  pageNo = 1;

  purchases: any[] = [];

  ngOnInit(): void {
    // this.getAllPurchase(this.pageNo, this.pageSize);
    this.route.queryParams.subscribe({
      next: (queryParams: any) => {
        // console.log(queryParams)
        this.getAllPurchase(queryParams.pageno || this.pageNo, queryParams.pagesize || this.pageSize)
      }
    })
  }
  ngOnDestroy(): void {
    this.destroy$.next(true);
  }

  getAllPurchase(pageNo: number, PageSize: number) {

    this._loaderService.showLoader();
    this._purchaseService.getAllPurchase(pageNo, this.pageSize)
      .pipe(takeUntil(this.destroy$), finalize(() => this._loaderService.hideLoader()))
      .subscribe({
        next: (resp: APIResponse) => {
          // console.log(resp)
          if (resp.status === 200) {
            this.purchases = resp.result;
            this.total = resp.result[0]['total_count'];
          }
        },
        error: (err) => {
          console.log('Error while fetching all purchases')
          console.log(err)
        }
      })

  }

  handlePageEvent(e:any) {
    // console.log(e)
    this._router.navigate(['/purchase/list-purchases'], {queryParams: {pageno: e.pageIndex + 1, pagesize: e.pageSize}})
  }

  onPurchaseClick(purchase_uid: string) {
    // console.log(purchase_uid)
    this._router.navigate([`purchase/purchase-details/${purchase_uid}`]);
  }

}
