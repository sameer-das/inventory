import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { APIResponse } from 'src/app/apiresponse';
import { StockService } from '../stock.service';
import { LoaderService } from 'src/app/loader.service';
import { PopupService } from 'src/app/popups/popup.service';

@Component({
  selector: 'app-new-item',
  templateUrl: './new-item.component.html',
  styleUrls: ['./new-item.component.scss']
})
export class NewItemComponent implements OnInit, OnDestroy {
  constructor(private _loaderService: LoaderService,private _stockService: StockService, private _popupService: PopupService) {

  }


  ngOnInit(): void {
    this.getAllBrands();
    this.getAllCategories();
  }

  private destroy$: Subject<boolean> = new Subject<boolean>();
  brands: any[] = [];
  categories: any[] = [];
  brand!: number;

  onSubmit(f:NgForm) {
    console.log(f.value)
    const item = {
      categoryId: f.value.category,
      brandId: f.value.brand,
      barCode: f.value.barcode,
      itemName:f.value.itemName
    }
    this._loaderService.showLoader();
    this._stockService.createItem(item)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next:(resp) => {
        this._loaderService.hideLoader();
        if(resp.status === 201) {
          this._popupService.openAlert({
            header: 'Success',
            message:'Item created successfully.'
          });
          f.reset();
        } else {
          this._popupService.openAlert({
            header: 'Fail',
            message:'Failed while creating item.'
          })
        }
      },
      error: (err: any) => {
        this._loaderService.hideLoader();
        console.log(err);
        this._popupService.openAlert({
          header:'Error',
          message: 'Error while creating item.'
        })
      }
    })
  }

  getAllBrands() {
    this._stockService.getBrands().pipe(takeUntil(this.destroy$)).subscribe({
      next: (resp: APIResponse) => {
        if (resp.status === 200){
          this.brands = resp.result;
          // console.log(this.brands);
        }
        else
          this.brands = []
      },
      error: (err: any) => {
        console.log(err);
        this.brands = []
      }
    })
  }
  getAllCategories() {
    this._stockService.getCategories().pipe(takeUntil(this.destroy$)).subscribe({
      next: (resp: APIResponse) => {
        if (resp.status === 200){
          this.categories = resp.result;
          // console.log(this.brands);
        }
        else
          this.categories = []
      },
      error: (err: any) => {
        console.log(err);
        this.categories = []
      }
    })
  }


  public ngOnDestroy(): void {
    this.destroy$.next(true); 
    this.destroy$.complete(); 
  }
}
