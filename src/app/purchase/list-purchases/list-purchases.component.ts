import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, finalize, takeUntil } from 'rxjs';
import { PurchaseService } from '../purchase.service';
import { LoaderService } from 'src/app/loader.service';
import { MatDialog } from '@angular/material/dialog';
import { APIResponse } from 'src/app/apiresponse';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-purchases',
  templateUrl: './list-purchases.component.html',
  styleUrls: ['./list-purchases.component.scss']
})
export class ListPurchasesComponent implements OnInit, OnDestroy {
  constructor(private _purchaseService: PurchaseService, private _loaderService: LoaderService,
    private _dialog: MatDialog, private _router: Router) { }

  private destroy$: Subject<boolean> = new Subject<boolean>();

  pageSize = 10;
  total = 0;
  pageNo = 1;

  purchases: any[] = [];

  ngOnInit(): void {
    this.getAllPurchase(this.pageNo, this.pageSize);
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
          }
        },
        error: (err) => {
          console.log('Error while fetching all purchases')
          console.log(err)
        }
      })

  }

  handlePageEvent(e:any) {
    console.log(e)
  }

  onPurchaseClick(purchase_uid: string) {
    console.log(purchase_uid)
    this._router.navigate([`purchase/purchase-details/${purchase_uid}`]);
  }

}
