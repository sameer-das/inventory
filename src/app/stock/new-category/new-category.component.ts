import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { LoaderService } from 'src/app/loader.service';
import { StockService } from '../stock.service';
import { Subject, takeUntil } from 'rxjs';
import { PopupService } from 'src/app/popups/popup.service';
@Component({
  selector: 'app-new-category',
  templateUrl: './new-category.component.html',
  styleUrls: ['./new-category.component.scss']
})
export class NewCategoryComponent implements OnInit,OnDestroy {

  constructor(private _loaderService: LoaderService,private _stockService: StockService, private _popupService: PopupService) {

  }

  private destroy$: Subject<boolean> = new Subject<boolean>();
  
  ngOnInit(): void {
    
  }
  ngOnDestroy(): void {
    
  }
  onSubmit(f:NgForm) {
    this._loaderService.showLoader();
    this._stockService.createCategory(f.value.categoryName)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next:(resp) => {
        this._loaderService.hideLoader();
        if(resp.status === 201) {
          this._popupService.openAlert({
            header: 'Success',
            message:'Category created successfully.'
          });
          f.reset();
        } else {
          this._popupService.openAlert({
            header: 'Fail',
            message:'Failed while creating category.'
          })
        }
      },
      error: (err: any) => {
        this._loaderService.hideLoader();
        console.log(err);
        this._popupService.openAlert({
          header:'Error',
          message: 'Error while creating category.'
        })
      }
    })
  }
}
