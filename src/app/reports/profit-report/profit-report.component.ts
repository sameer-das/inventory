import { Component, OnInit, OnDestroy } from '@angular/core';
import { PopupService } from 'src/app/popups/popup.service';
import { RealtionsService } from 'src/app/realations/realtions.service';
import { ReportsService } from '../reports.service';
import { LoaderService } from 'src/app/services/loader.service';
import { Subject, finalize, takeUntil } from 'rxjs';
import { APIResponse } from 'src/app/apiresponse';

@Component({
  selector: 'app-profit-report',
  templateUrl: './profit-report.component.html',
  styleUrls: ['./profit-report.component.scss']
})
export class ProfitReportComponent implements OnInit, OnDestroy {
  constructor(private _relationsService: RealtionsService,
    private _popupService: PopupService,
    private _reportService: ReportsService,
    private _loaderService: LoaderService) { }
  private destroy$: Subject<boolean> = new Subject<boolean>();

  reportType = '1';
  startDate!: Date | undefined;
  endDate!: Date | undefined;
  today = new Date();
  reportData: any[] = [];
  totalProfit: number = 0;
  totalSale: number = 0;
  showBrandDropdown: boolean = false;
  selectedBrand!: any;

  brands: any[] = [];
  brandsFetched: boolean = false;

  ngOnInit(): void {
    // throw new Error('Method not implemented.');
    // this.getAllBrands()
  }
  ngOnDestroy(): void {
    this.destroy$.next(false)
  }

  onSelectionChange() {
    this.reportData = [];
    this.totalProfit = 0;
    this.totalSale = 0;
    
    this.showBrandDropdown = +this.reportType === 2;
    if (!this.brandsFetched && +this.reportType === 2) {
      this.getAllBrands()
    }
  }


  onGenerate() {

    if (!this.startDate || !this.endDate) {
      this._popupService.openAlert({
        header: 'Alert',
        message: 'Please choose a valid date range.'
      });
      return;
    }

    // --------------------------------------------
    if (+this.reportType === 2 && !this.selectedBrand) {
      this._popupService.openAlert({
        header: 'Alert',
        message: 'Please select a brand!'
      });
      return;
    }

    // ---------------------------------------------------

    console.log(this.getFormatedDate(this.startDate), this.getFormatedDate(this.endDate), this.reportType);
    this._loaderService.showLoader();
    this._reportService
      .getProfitReport(+this.reportType, this.getFormatedDate(this.startDate), this.getFormatedDate(this.endDate), this.selectedBrand)
      .pipe(takeUntil(this.destroy$), finalize(() => this._loaderService.hideLoader()))
      .subscribe({
        next: (resp: APIResponse) => {
          console.log(resp)
          if (resp.status === 200 && resp.result.length > 0) {
            this.reportData = resp.result;
            this.calculateTotal();
          }

          if (resp.result.length === 0) {
            //no data found
          }
        },
        error: (err: any) => {
          console.log('Error while fetching report')
          console.log(err)
        }
      });
  }

  getFormatedDate(date: Date): string {
    // console.log(date.toISOString())
    const indianTime = new Date(new Date(date).getTime() + (5.5 * 3600 * 1000)).toISOString();
    // console.log(indianTime)
    return indianTime.split('T')[0]
  }

  onClear() {
    this.startDate = undefined;
    this.endDate = undefined;
    this.reportData = [];
    this.totalProfit = 0;
    this.totalSale = 0;
  }

  calculateTotal() {
    this.totalProfit = this.reportData.reduce((acc, curr) => {
      return acc + +curr.profit
    }, 0);
    this.totalSale = this.reportData.reduce((acc, curr) => {
      return acc + +curr.sale
    }, 0);

    this.totalProfit = +this.totalProfit.toFixed(2)
    this.totalSale = +this.totalSale.toFixed(2)

  }


  getAllBrands() {
    this._loaderService.showLoader();
    this._reportService.getBrands()
      .pipe(takeUntil(this.destroy$), finalize(() => this._loaderService.hideLoader()))
      .subscribe({
        next: (resp: APIResponse) => {
          console.log(resp)
          if (resp.status === 200) {
            this.brands = resp.result;
            this.brandsFetched = true;
          }
        },
        error: (err: any) => {
          console.log('Error while fetching brands')
          console.log(err)
        }
      });
  }
}
