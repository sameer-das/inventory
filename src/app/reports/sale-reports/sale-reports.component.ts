import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormControl, ValidatorFn } from '@angular/forms';
import { Observable, Subject, debounceTime, distinctUntilChanged, finalize, map, switchMap, takeUntil } from 'rxjs';
import { PopupService } from 'src/app/popups/popup.service';
import { RealtionsService } from 'src/app/realations/realtions.service';
import { ReportsService } from '../reports.service';
import { LoaderService } from 'src/app/services/loader.service';
import { APIResponse } from 'src/app/apiresponse';
import { SearchItemService } from 'src/app/search-item/search-item.service';


function autocompleteObjectValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    if (typeof control.value === 'string') {
      return { 'invalidAutocompleteObject': { value: control.value } }
    }
    return null  /* valid option selected */
  }
}


@Component({
  selector: 'app-sale-reports',
  templateUrl: './sale-reports.component.html',
  styleUrls: ['./sale-reports.component.scss']
})
export class SaleReportsComponent implements OnInit, OnDestroy {

  constructor(private _relationsService: RealtionsService,
    private _popupService: PopupService,
    private _reportService: ReportsService,
    private _loaderService: LoaderService,
    private _searchItemService: SearchItemService) { }
  private destroy$: Subject<boolean> = new Subject<boolean>();

  reportType = '1';
  startDate!: Date | undefined;
  endDate!: Date | undefined;
  today = new Date();
  reportData: any[] = [];

  showItemSearch: boolean = false;
  showCustomerSearch: boolean = false;

  customerControl: FormControl = new FormControl('', [autocompleteObjectValidator()]);
  filteredCustomerOptions!: Observable<any[]>;

  selectedItem: any;

  ngOnInit(): void {
    this.filteredCustomerOptions = this.customerControl.valueChanges.pipe(
      takeUntil(this.destroy$),
      distinctUntilChanged(),
      debounceTime(300),
      map(x => x ? x : ''),
      switchMap(search => this._relationsService.searchRelation('customer', search))
    );
  }


  ngOnDestroy(): void {
    this.destroy$.next(false);
  }


  onSelectionChange() {
    // console.log(this.reportType)
    this.selectedItem = undefined;
    if (+this.reportType === 3) { // show item search
      this.showItemSearch = true;
      this.showCustomerSearch = false;
    } else if (+this.reportType === 2) { //show customer search
      this.showItemSearch = false;
      this.showCustomerSearch = true;
    } else if (+this.reportType === 1) { // show nothing
      this.showCustomerSearch = false;
      this.showItemSearch = false;
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
    if (+this.reportType === 2 && (!this.customerControl.value || this.customerControl.invalid)) {
      this._popupService.openAlert({
        header: 'Alert',
        message: 'Please choose a customer!'
      });
      return;
    }
    else if (+this.reportType === 3 && !this.selectedItem) {
      this._popupService.openAlert({
        header: 'Alert',
        message: 'Please choose an item!'
      });
      return;
    }

    // ---------------------------------------------------

    console.log(this.getFormatedDate(this.startDate), this.getFormatedDate(this.endDate), this.reportType);
    this._loaderService.showLoader();
    this._reportService
      .getSaleReport(+this.reportType, this.getFormatedDate(this.startDate), this.getFormatedDate(this.endDate), this.customerControl?.value?.customer_name, this.selectedItem?.item_id)
      .pipe(takeUntil(this.destroy$), finalize(() => this._loaderService.hideLoader()))
      .subscribe({
        next: (resp: APIResponse) => {
          console.log(resp)
          if (resp.status === 200 && resp.result.length > 0) {
            this.reportData = resp.result;
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


  onItemSelection(e: any) {
    console.log(e)
    this.selectedItem = e;
  }



  getFormatedDate(date: Date): string {
    // console.log(date.toISOString())
    const indianTime = new Date(new Date(date).getTime() + (5.5 * 3600 * 1000)).toISOString();
    // console.log(indianTime)
    return indianTime.split('T')[0]
  }

  onClear() {
    this.selectedItem = undefined;
    this.customerControl.reset();
    this.startDate = undefined;
    this.endDate = undefined;
    this.reportData = [];
    this._searchItemService.clearItemSearch();
  }


  // Customer Search Realted Code
  displayWith(option: any) {
    return option ? option.customer_name : undefined;
  }

  onCustomerSelection(customer: any) {
    console.log(this.customerControl.value)
  }
}
