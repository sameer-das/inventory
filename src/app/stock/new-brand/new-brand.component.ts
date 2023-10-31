import { Component, OnDestroy, OnInit } from '@angular/core';
import { StockService } from '../stock.service';
import { LoaderService } from 'src/app/services/loader.service';
import { NgForm } from '@angular/forms';
import { APIResponse } from 'src/app/apiresponse';
import { PopupService } from 'src/app/popups/popup.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-new-brand',
  templateUrl: './new-brand.component.html',
  styleUrls: ['./new-brand.component.scss']
})
export class NewBrandComponent implements OnInit, OnDestroy{
  constructor(private _stockService: StockService, private _loaderService: LoaderService, private _popupService: PopupService) {}

  private destroy$: Subject<boolean> = new Subject<boolean>();

  ngOnInit(): void {

  }

  onSubmit(f: NgForm) {
    this._loaderService.showLoader();
    this._stockService.createBrand(f.value.brandname)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next:(resp) => {
        this._loaderService.hideLoader();
        if(resp.status === 201) {
          this._popupService.openAlert({
            header: 'Success',
            message:'Brand created successfully.'
          });
          f.reset();
        } else {
          this._popupService.openAlert({
            header: 'Fail',
            message:'Failed while creating brand.'
          })
        }
      },
      error: (err: any) => {
        this._loaderService.hideLoader();
        console.log(err);
        this._popupService.openAlert({
          header:'Error',
          message: 'Error while creating brand.'
        })
      }
    })
  }


  ngOnDestroy(): void {
    this.destroy$.next(true); 
    this.destroy$.complete(); 
  }

}
