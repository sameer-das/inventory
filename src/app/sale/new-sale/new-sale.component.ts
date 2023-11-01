import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, Subject, debounceTime, distinctUntilChanged, finalize, map, switchMap, takeUntil } from 'rxjs';
import { NewSalePopupComponent } from 'src/app/popups/new-sale-popup/new-sale-popup.component';
import { SaleService } from '../sale.service';
import { PopupService } from 'src/app/popups/popup.service';
import { APIResponse } from 'src/app/apiresponse';
import { LoaderService } from 'src/app/services/loader.service';
import { SearchItemService } from 'src/app/search-item/search-item.service';
import { AbstractControl, FormControl, ValidatorFn, Validators } from '@angular/forms';
import { RealtionsService } from 'src/app/realations/realtions.service';
import { AddRelationsComponent } from 'src/app/popups/add-relations/add-relations.component';

function autocompleteObjectValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    if (typeof control.value === 'string') {
      return { 'invalidAutocompleteObject': { value: control.value } }
    }
    return null  /* valid option selected */
  }
}

@Component({
  selector: 'app-new-sale',
  templateUrl: './new-sale.component.html',
  styleUrls: ['./new-sale.component.scss']
})
export class NewSaleComponent implements OnInit, OnDestroy {

  constructor(private _matdialog: MatDialog, private _saleService: SaleService,
    private _popupService: PopupService, private _loaderService: LoaderService,
    private _searchItemService: SearchItemService,
    private _relationsService: RealtionsService) { }

  private destroy$: Subject<boolean> = new Subject<boolean>();

  saleDate: string = '';

  // customerName: string = '';
  // customerGSTN: string = '';
  // customerPhone: string = '';

  customerControl: FormControl = new FormControl('', [Validators.required, autocompleteObjectValidator()]);

  billNo: string = '';
  // today: Date = new Date();

  saleItems: any[] = [];

  totalSaleAmount: number = 0;

  customer!: any;
  filteredCustomerOptions!: Observable<any[]>;
  ngOnInit(): void {
    this.getNextBillNo();

    this.filteredCustomerOptions = this.customerControl.valueChanges.pipe(
      takeUntil(this.destroy$),
      distinctUntilChanged(),
      debounceTime(300),
      map(x => x ? x : ''),
      switchMap(search => this._relationsService.searchRelation('customer', search))
    );
  }
  ngOnDestroy(): void {
    this.destroy$.next(true)
  }

  onItemSelection(item?: any) {
    this._matdialog.open(NewSalePopupComponent, {
      minWidth: '85vw',
      height: '95vh',
      disableClose: true,
      panelClass: 'new-sale-popup',
      data: { isEdit: false, item: item }

    }).afterClosed().subscribe((data: any) => {
      if (data && !data.isEdit) {
        this.saleItems.push(data.item);
        this.calculateSummary();
        this.clearSearch();
      }
    })
  }

  calculateSummary() {
    this.totalSaleAmount = 0;
    this.saleItems.forEach((item: any) => {
      this.totalSaleAmount += item.totalAmount;
    })
  }


  onSubmit() {
    console.log(this.saleItems);
    if (this.saleItems.length === 0) {
      this._popupService.openAlert({
        header: 'Alert',
        message: 'Please add items.'
      })
      return;
    }
    if (!this.saleDate) {
      this._popupService.openAlert({
        header: 'Alert',
        message: 'Please choose sale/bill date.'
      })
      return;
    }

    const sale = {
      customerGSTN: this.customerControl.value.customer_gstn,
      customerName: this.customerControl.value.customer_name,
      customerPhone: this.customerControl.value.customer_phone,
      billNo: this.billNo,
      saleDate: new Date(this.saleDate)
        .toLocaleDateString().split('/').reverse().join('-'),
      saleItems: this.saleItems
    }

    this._loaderService.showLoader();

    this._saleService.saveSale(sale)
      .pipe(takeUntil(this.destroy$), finalize(() => this._loaderService.hideLoader()))
      .subscribe({
        next: (resp) => {
          console.log(resp)
          if (resp.status === 200) {
            this._popupService.openAlert({
              header: 'Success',
              message: `Bill No : ${resp.result} has been created successfully!`
            });

            this.getNextBillNo();
            this.saleItems = [];
            // this.customerGSTN = '';
            // this.customerName = '';
            // this.customerPhone = '';
            this.customerControl.reset();
            this.saleDate = '';
            this.totalSaleAmount = 0;

          } else {
            this._popupService.openAlert({
              header: 'Alert',
              message: `Failed while saving sale. Please try again.`
            });
          }
        },
        error: (err) => {
          console.log(err)
          this._popupService.openAlert({
            header: 'Fail',
            message: `Error while saving sale. ${err.message}`
          });
        }
      })
  }

  onDoubleClick(item: any, i: number) {
    console.log(i)
    console.log(item);
    this._matdialog.open(NewSalePopupComponent, {
      minWidth: '85vw',
      height: '95vh',
      disableClose: true,
      panelClass: 'new-sale-popup',
      data: { isEdit: true, item: item }

    }).afterClosed().subscribe((data: any) => {
      console.log(data);

      if (data.isEdit) {
        this.saleItems[i] = data.item;
        this.calculateSummary()
      }

    })
  }


  getNextBillNo() {
    this._loaderService.showLoader();

    this._saleService.getNextBillNo()
      .pipe(takeUntil(this.destroy$), finalize(() => this._loaderService.hideLoader()))
      .subscribe({
        next: (resp: APIResponse) => {
          // console.log(resp);
          if (resp.status === 200) {
            this.billNo = resp.result;
          } else {
            this.billNo = 'Bill Error'
          }
        },
        error: (err) => {
          console.log('Error fetcing bill no')
          console.log(err)
          this.billNo = 'Bill Error'
        }
      })
  }



  clearSearch() {
    this._searchItemService.clearItemSearch();
  }


  onCancelSale() {
    this.saleDate = '';
    this.customerControl.reset();
    this.saleItems = [];
  }


  onAddCustomer(){
    this._matdialog.open(AddRelationsComponent,{
      width: '400px',
      height: '350px',
      disableClose: true,
      data: { name: 'Customer' }
    })
  }


  // Customer Search Realted Code
  displayWith(option: any) {
    return option ? option.customer_name : undefined;
  }

  onCustomerSelection(customer: any) {
    console.log(customer)
  }

  public validation_msgs = {
    'customerControl': [
      { type: 'invalidAutocompleteObject', message: 'Customer name not recognized. Choose one of the options' },
      { type: 'required', message: 'Customer name is required.' }
    ],
  }


}
