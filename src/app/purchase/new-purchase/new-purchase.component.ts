import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { Observable, Subject, debounceTime, distinctUntilChanged, map, switchMap, takeUntil } from 'rxjs';
import { LoaderService } from 'src/app/services/loader.service';
import { NewPurchasePopupComponent } from 'src/app/popups/new-purchase-popup/new-purchase-popup.component';
import { PopupService } from 'src/app/popups/popup.service';
import { SearchItemService } from 'src/app/search-item/search-item.service';
import { PurchaseService } from '../purchase.service';
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
  selector: 'app-new-purchase',
  templateUrl: './new-purchase.component.html',
  styleUrls: ['./new-purchase.component.scss']
})
export class NewPurchaseComponent implements OnInit, OnDestroy {


  constructor(private _matdialog: MatDialog,
    private _purchaseService: PurchaseService,
    private _searchItemService: SearchItemService,
    private _loaderService: LoaderService,
    private _popupService: PopupService,
    private _relationsService: RealtionsService) { }


  today: Date = new Date();
  private destroy$: Subject<boolean> = new Subject<boolean>();

  purchasedItems: any[] = [];

  totalGst: number = 0.00;
  totalDiscount: number = 0.00;
  totalAmount: number = 0.00;


  purchaseDate: string = '';
  billerName: string = '';
  billerGSTN: string = '';

  billerControl: FormControl = new FormControl('', [Validators.required, autocompleteObjectValidator()]);

  filteredBillerOptions!: Observable<any[]>;

  ngOnInit() {
    this.filteredBillerOptions = this.billerControl.valueChanges.pipe(
      takeUntil(this.destroy$),
      distinctUntilChanged(),
      debounceTime(300),
      map(x => x ? x : ''),
      switchMap(search => this._relationsService.searchRelation('biller', search))
    );
  }

  onItemSelection(item: any) {
    this._matdialog.open(NewPurchasePopupComponent, {
      minWidth: '85vw',
      height: '95vh',
      disableClose: true,
      panelClass: 'new-purchase-popup',
      data: { isEdit: false, item },
    }).afterClosed().subscribe((data: any) => {
      if (data.shouldAdd) {
        // console.log(data.item);
        this.purchasedItems.push(data.item);
        this.calculateTotal();
        this.clearSearch()
      }
    })
  }

  calculateTotal() {
    if (this.purchasedItems.length === 0) {
      this.totalGst = 0.00;
      this.totalDiscount = 0.00;
      this.totalAmount = 0.00;
    } else if (this.purchasedItems.length > 0) {
      this.totalGst = 0.00;
      this.totalDiscount = 0.00;
      this.totalAmount = 0.00;

      this.purchasedItems.forEach((item) => {
        this.totalAmount = +(this.totalAmount + +item.totalPrice).toFixed(2);
        this.totalGst = +(this.totalGst + +item.taxAmount).toFixed(2);
        this.totalDiscount = +(this.totalDiscount + +item.discountPrice).toFixed();
      })
    }
  }

  @ViewChild(MatMenuTrigger) contextMenu!: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };
  onContextMenu(e: MouseEvent, item: any, i: number) {
    e.preventDefault();
    console.log(item)
    this.contextMenuPosition.x = e.clientX + 'px';
    this.contextMenuPosition.y = e.clientY + 'px';
    this.contextMenu.menuData = { 'item': item, i: i };
    // this.contextMenu.menu.focusFirstItem('mouse');
    this.contextMenu.openMenu();
  }

  onEdit(item: any, i: number) {
    // console.log(item, i);
    this._matdialog.open(NewPurchasePopupComponent, {
      minWidth: '85vw',
      height: '95vh',
      disableClose: true,
      panelClass: 'new-purchase-popup',
      data: { isEdit: true, item },
    }).afterClosed().subscribe((editData: any) => {
      if (editData.isEdit) {
        this.purchasedItems[i] = editData.item;
        this.calculateTotal();
      }
    })
  }

  onDelete(item: any, i: number) {
    console.log(item);
    this.purchasedItems.splice(i, 1);
    this.calculateTotal();
  }


  onSaveBill() {
    // console.log(this.purchasedItems);
    if (this.purchasedItems.length === 0) {
      this._popupService.openAlert({
        header: 'Alert',
        message: 'Please add items.'
      })
      return;
    }
    if (!this.purchaseDate) {
      this._popupService.openAlert({
        header: 'Alert',
        message: 'Please choose purchase/bill date.'
      })
      return;
    }

    const pdate = this.getFormatedDate(this.purchaseDate);

    this.purchasedItems = this.purchasedItems.
      map(curr => {
        return {
          ...curr,
          purchase_date: pdate,
          biller_name: this.billerControl.value.biller_name,
          biller_gstn: this.billerControl.value.biller_gstn
        }
      })



    // console.log(this.purchaseDate);
    // console.log(this.billerName);
    // console.log(this.billerGSTN);


    this._loaderService.showLoader();
    this._purchaseService.addPurchase(this.purchasedItems)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (resp) => {
          this._loaderService.hideLoader()
          if (resp.status === 200) {
            this._popupService.openAlert({
              header: 'Success',
              message: 'Purchase Added Successfully!'
            });
            this.clearBillData();
          } else {
            this._popupService.openAlert({
              header: 'Fail',
              message: 'Failed while adding purchase!'
            });
          }
        },
        error: (error: any) => {
          this._loaderService.hideLoader()
          this._popupService.openAlert({
            header: 'Error',
            message: 'Error while adding purchase!'
          });
        }
      })
  }

  onCancelBill() {
    this.billerControl.reset();
    this.purchaseDate = '';
    this.purchasedItems = [];
  }


  clearSearch() {
    this._searchItemService.clearItemSearch();
  }

  clearBillData() {
    this.billerGSTN = '';
    this.billerName = '';
    this.purchaseDate = '';
    this.totalGst = 0.00;
    this.totalDiscount = 0.00;
    this.totalAmount = 0.00;
    this.purchasedItems = [];
  }

  ngOnDestroy(): void {
    this.destroy$.next(true)
  }

  onAddBiller() {
    this._matdialog.open(AddRelationsComponent, {
      width: '400px',
      height: '350px',
      disableClose: true,
      data: { name: 'Biller' }
    });
  }

  // Biller Auto Complete details
  // Customer Search Realted Code
  displayWith(option: any) {
    return option ? option.biller_name : undefined;
  }

  onBillerSelection(biller: any) {
    console.log(biller.value)
  }

  getFormatedDate(date: string): string {
    return new Date(new Date(date).getTime() + (5.5 * 3600 * 1000)).toISOString().split('T')[0]
  }

  onDateChange() {
    console.log(this.purchaseDate)
    console.log('Purchase Date: ' + this.getFormatedDate(this.purchaseDate));
  }

  public validation_msgs = {
    'customerControl': [
      { type: 'invalidAutocompleteObject', message: 'Biller name not recognized. Choose one of the options' },
      { type: 'required', message: 'Biller name is required.' }
    ],
  }
}
