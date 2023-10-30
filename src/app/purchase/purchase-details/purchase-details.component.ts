import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PurchaseService } from '../purchase.service';
import { LoaderService } from 'src/app/loader.service';
import { PopupService } from 'src/app/popups/popup.service';
import { Subject, finalize, takeUntil } from 'rxjs';
import { APIResponse } from 'src/app/apiresponse';

@Component({
  selector: 'app-purchase-details',
  templateUrl: './purchase-details.component.html',
  styleUrls: ['./purchase-details.component.scss']
})
export class PurchaseDetailsComponent implements OnInit, OnDestroy {
  constructor(private _route: ActivatedRoute, private _router: Router,
    private _purchaseService: PurchaseService, private _loaderService: LoaderService,
    private _popupService: PopupService) { }

  private destroy$: Subject<boolean> = new Subject<boolean>();

  purchaseDetails: any[] = [];
  purchase_uid: string = '';

  showGst: boolean = false;


  ngOnInit(): void {
    this._route.params.subscribe((params: any) => {
      if (!params.purchase_uid) {
        this._router.navigate(['/purchase/list-purchases']);
      } else {
        this.purchase_uid = params.purchase_uid;
        this.getPurcahseDetails(params.purchase_uid);
      }
    })
  }


  ngOnDestroy(): void {
    this.destroy$.next(true)
  }

  getPurcahseDetails(purcahseUid: string) {
    this._loaderService.showLoader();
    this._purchaseService.getPurchaseDetails(purcahseUid)
      .pipe(takeUntil(this.destroy$), finalize(() => this._loaderService.hideLoader()))
      .subscribe({
        next: (resp: APIResponse) => {
          // console.log(resp)
          if (resp.status === 200) {
            this.purchaseDetails = resp.result;

            if (this.purchaseDetails.length !== 0){
              this.calculateGst();
              this.calculateTotals();
            }

            if (this.purchaseDetails.length === 0) {
              this._popupService.openAlert({
                header: 'Alert',
                message: 'Purchase details not found',
              })
            }

          }
        },
        error: (err: any) => {
          console.log('Error while fetching all sales')
          console.log(err)
        }
      })
  }

  toggleShowGst() {
    this.showGst = !this.showGst;
  }

  gstDetails: { [key: string]: number } = {
    '5': 0,
    '12': 0,
    '18': 0,
    '28': 0,
    'total': 0
  }

  totalDiscount = 0;
  totalAmount = 0;
  calculateGst() {
    this.purchaseDetails.forEach((curr: any) => {
      this.gstDetails[curr.gst] = this.gstDetails[curr.gst] + +curr.tax_amount;
      this.gstDetails['total'] = this.gstDetails['total'] + +curr.tax_amount;
      
      this.totalDiscount = +(this.totalDiscount + +curr.discount_price).toFixed(2);
      this.totalAmount = +(this.totalAmount + +curr.total_price).toFixed(2);
    })
    this.gstDetails['total'] = +this.gstDetails['total'].toFixed(2)
    console.log(this.gstDetails)
  }


  calculateTotals(){

  }
}
