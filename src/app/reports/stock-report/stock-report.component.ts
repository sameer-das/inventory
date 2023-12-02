import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, finalize, takeUntil } from 'rxjs';
import { LoaderService } from 'src/app/services/loader.service';
import { ReportsService } from '../reports.service';
import { APIResponse } from 'src/app/apiresponse';
@Component({
  selector: 'app-stock-report',
  templateUrl: './stock-report.component.html',
  styleUrls: ['./stock-report.component.scss']
})
export class StockReportComponent implements OnInit, OnDestroy {

  constructor(private _loaderService:LoaderService, private _reportsService: ReportsService) {

  }

  private destroy$: Subject<boolean> = new Subject<boolean>();
  reportData: any[] = [];
  now: Date = new Date();
  brands: any[] = [];
  selectedBrand!: any;

  ngOnDestroy(): void {
    this.destroy$.next(true)
  }
  ngOnInit(): void {
    this.getAllBrands();
  }


  onGenerate () {
    this.getCurrentStockReport(this.selectedBrand.brand_id);
  }
  onClear() {
    this.reportData = [];
    this.selectedBrand = undefined;
  }
  getCurrentStockReport(brandId: number) {
    this._loaderService.showLoader();
    this._reportsService.getStockReportBrandWise(brandId)
      .pipe(takeUntil(this.destroy$), finalize(() => this._loaderService.hideLoader()))
      .subscribe({
        next: (resp: APIResponse) => {
          console.log(resp)
          if (resp.status === 200 && resp.result.length > 0) {
            this.getPieceAndBox(resp.result);
            this.now = new Date();
          }

          if(resp.result.length === 0) {
            //no data found
          }
        },
        error: (err: any) => {
          console.log('Error while fetching report')
          console.log(err)
        }
      });
  }


  getPieceAndBox(data:any[]) {
    this.reportData =  data.map((curr:any) => {
      return {
        ...curr,
        boxQty: Math.floor(+curr.sum / +curr.piece_per_carton),
        pieceQty: +curr.sum - (Math.floor(+curr.sum / +curr.piece_per_carton) * curr.piece_per_carton)
      }
    })
  }

  getAllBrands() {
    this._loaderService.showLoader();
    this._reportsService.getBrands()
      .pipe(takeUntil(this.destroy$), finalize(() => this._loaderService.hideLoader()))
      .subscribe({
        next: (resp: APIResponse) => {
          console.log(resp)
          if (resp.status === 200) {
            this.brands = resp.result;
          }
        },
        error: (err: any) => {
          console.log('Error while fetching brands')
          console.log(err)
        }
      });
  }

}
