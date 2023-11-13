import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
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
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatMenuTrigger } from '@angular/material/menu';

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

  // saleDate: Date = new Date();
  saleDate = this.getCurrentISTime();
  // customerName: string = '';
  // customerGSTN: string = '';
  // customerPhone: string = '';

  customerControl: FormControl = new FormControl('', [Validators.required, autocompleteObjectValidator()]);

  billNo: string = '';
  // today: Date = new Date();

  saleItems: any[] = [];

  totalSaleAmount: number = 0;
  totalGstAmount: number = 0;
  totalProfitAmount: number = 0;

  customer!: any;
  filteredCustomerOptions!: Observable<any[]>;

  showGstDetails: boolean = false;

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
        this.clearSearch();
        this.calculateTaxAndProfit();
        this.calculateSummary();
        console.log(this.saleItems)
      }
    })
  }

  calculateSummary() {
    this.totalSaleAmount = 0;
    this.totalGstAmount = 0;
    this.totalProfitAmount = 0;

    this.saleItems.forEach((item: any) => {
      this.totalSaleAmount = +(this.totalSaleAmount + +item.totalAmount).toFixed(2);
      this.totalGstAmount = +(this.totalGstAmount + +item.totalGSTEarned).toFixed(2);
      this.totalProfitAmount = +(this.totalProfitAmount + +item.totalProfitEarned).toFixed(2);
    })
  }

  gstDetails: { [key: string]: number } = {
    '5': 0,
    '12': 0,
    '18': 0,
    '28': 0,
    'total': 0
  }

  calculateTaxAndProfit() {
    this.gstDetails = { '5': 0, '12': 0, '18': 0, '28': 0, 'total': 0 };

    this.saleItems.forEach((item: any) => {
      item.totalProfitEarned = 0;
      item.totalGSTEarned = 0;
      item.totalGSTPaid = 0;


      item.stocks.lines.forEach((line: any) => {
        item.totalGSTEarned = +(item.totalGSTEarned + +line.itemDetails.gstEarned).toFixed(2);
        item.totalProfitEarned = +(item.totalProfitEarned + +line.itemDetails.profitEarned).toFixed(2);

        line.itemDetails.gstPaidPerPiece = +(+line.itemDetails.purchasePricePerPiece - (+line.itemDetails.purchasePricePerPiece / (1 + (+line.itemDetails.gst * 0.01)))).toFixed(2)
        line.itemDetails.gstPaidTotal = +(line.itemDetails.gstPaidPerPiece * line.itemDetails.totalSaleQuantity).toFixed(2);

        item.totalGSTPaid = item.totalGSTPaid + line.itemDetails.gstPaidTotal;

        this.gstDetails[line.itemDetails.gst] = +(this.gstDetails[line.itemDetails.gst] + +line.itemDetails.gstEarned).toFixed(2);
        this.gstDetails['total'] = +(this.gstDetails['total'] + +line.itemDetails.gstEarned).toFixed(2);
      })
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
      saleDate: this.getFormatedDate(this.saleDate),
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
            this.saleDate = this.getCurrentISTime();
            this.totalSaleAmount = 0;
            this.totalGstAmount = 0;
            this.totalProfitAmount = 0;
          

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
        this.calculateTaxAndProfit();
        this.calculateSummary();
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
    this.saleDate = this.getCurrentISTime();
    this.customerControl.reset();
    this.saleItems = [];
  }


  onAddCustomer() {
    this._matdialog.open(AddRelationsComponent, {
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

  onDateChange() {
    // console.log(this.saleDate)
    console.log('Sale Date: ' + this.getFormatedDate(this.saleDate));
  }

  getFormatedDate(date: Date): string {
    const indianTime = new Date(new Date(date).getTime() + (5.5 * 3600 * 1000)).toISOString();
    console.log(indianTime)
    return indianTime.split('T')[0]
  }

  getCurrentISTime() {
    return new Date()
  }

  showGSTColumn: boolean = false;
  showProfitColumn: boolean = false;

  toggleShowGST(e: MatCheckboxChange) {
    this.showGSTColumn = e.checked;

  }
  toggleShowProfit(e: MatCheckboxChange) {
    this.showProfitColumn = e.checked;
  }

  @ViewChild(MatMenuTrigger) contextMenu!: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };
  onContextMenu(e: MouseEvent, item: any, i: number) {
    e.preventDefault();
    // console.log(item)
    this.contextMenuPosition.x = e.clientX + 'px';
    this.contextMenuPosition.y = e.clientY + 'px';
    this.contextMenu.menuData = { 'item': item, i: i };
    // this.contextMenu.menu.focusFirstItem('mouse');
    this.contextMenu.openMenu();
  }


  onDelete(item: any, i: number) {
    // console.log(item);
    this.saleItems.splice(i, 1);
    this.calculateTaxAndProfit();
    this.calculateSummary();
  }
}
