import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { Subject, finalize, switchMap, takeUntil } from 'rxjs';
import { SaleService } from '../sale.service';
import { LoaderService } from 'src/app/loader.service';
import { APIResponse } from 'src/app/apiresponse';
import { PopupService } from 'src/app/popups/popup.service';

@Component({
  selector: 'app-sale-details',
  templateUrl: './sale-details.component.html',
  styleUrls: ['./sale-details.component.scss']
})
export class SaleDetailsComponent implements OnInit, OnDestroy {
  constructor(private _route: ActivatedRoute, private _router: Router,
    private _saleService: SaleService, private _loaderService: LoaderService,
    private _popupService: PopupService) { }

  private destroy$: Subject<boolean> = new Subject<boolean>();

  saleDetails: any[] = [];
  totalAmount = 0;
  totalQtyBox = 0;
  totalPieceBox = 0;

  showGst: boolean = false;
  gstDetailsFetched: boolean = false;
  sale_uid: string = '';


  ngOnInit(): void {
    this._route.params.subscribe((params: any) => {
      if (!params.sale_uid) {
        this._router.navigate(['/sale/list-sales']);
      } else {
        this.sale_uid = params.sale_uid;
        this.getSaleDetails(params.sale_uid);
      }
    })
  }
  ngOnDestroy(): void {
    this.destroy$.next(true)
  }


  getSaleDetails(saleUid: string) {
    this._loaderService.showLoader();
    this._saleService.getSaleDetails(saleUid)
      .pipe(takeUntil(this.destroy$), finalize(() => this._loaderService.hideLoader()))
      .subscribe({
        next: (resp: APIResponse) => {
          // console.log(resp)
          if (resp.status === 200) {
            this.saleDetails = resp.result;

            if (this.saleDetails.length !== 0)
              this.calculateTotal();

            if (this.saleDetails.length === 0) {
              this._popupService.openAlert({
                header: 'Alert',
                message: 'Sale details not found',
              })
            }

          }
        },
        error: (err) => {
          console.log('Error while fetching all sales')
          console.log(err)
        }
      })
  }

  calculateTotal() {
    this.saleDetails.forEach((curr: any) => {
      this.totalAmount += +curr.total_amount;
      this.totalQtyBox += +curr.sale_box_quantity;
      this.totalPieceBox += +curr.sale_piece_quantity;
    })
  }


  toggleShowGst() {
    this.showGst = !this.showGst;
    if (this.showGst && !this.gstDetailsFetched) {
      this.getGstDetails();
    }
  }

  gstDetails: { [key: string]: number } = {
    '5': 0,
    '12': 0,
    '18': 0,
    '28': 0,
    'total': 0
  }

  getGstDetails() {
    this._saleService.getGstDetailsOfSale(this.sale_uid)
      .pipe(takeUntil(this.destroy$), finalize(() => this._loaderService.hideLoader()))
      .subscribe({
        next: (resp: APIResponse) => {
          // console.log(resp)
          if (resp.status === 200) {
            this.gstDetailsFetched = true;
            resp.result.forEach((curr: any) => {
              this.gstDetails[curr.gst_rate] = curr.sum;
              this.gstDetails['total'] = +(this.gstDetails['total'] + +curr.sum).toFixed(2);
            });
            // console.log(this.gstDetails)
          }
        },
        error: (err) => {
          console.log('Error while fetching gst details of sale')
          console.log(err)
        }
      })
  }

}
