import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatRadioChange } from '@angular/material/radio';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { debounceTime, filter } from 'rxjs';
import { PopupService } from '../popup.service';

@Component({
  selector: 'app-new-purchase-popup',
  templateUrl: './new-purchase-popup.component.html',
  styleUrls: ['./new-purchase-popup.component.scss']
})
export class NewPurchasePopupComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public item: any,
    private _dialogRef: MatDialogRef<NewPurchasePopupComponent>,
    private _popupService: PopupService) { }


  AllowOnlyNumbersAndTwoDecimalPoint = /^[0-9][0-9]*[.]?[0-9]{0,2}$/;
  AllowOnlyNumbers = /^[0-9]+$/;
  enable: boolean = false;

  newItemPurchaseFormGroup: FormGroup = new FormGroup({
    mrp: new FormControl('0', {
      updateOn: 'blur',
      validators: [Validators.required, Validators.pattern(this.AllowOnlyNumbersAndTwoDecimalPoint)]
    }),
    quantityBox: new FormControl('0', {
      updateOn: 'blur',
      validators: [Validators.required, Validators.pattern(this.AllowOnlyNumbers)]
    }),
    piecePerCarton: new FormControl('0', {
      updateOn: 'blur',
      validators: [Validators.required, Validators.pattern(this.AllowOnlyNumbers)]
    }),
    quantityPiece: new FormControl('0', {
      updateOn: 'blur',
      validators: [Validators.required, Validators.pattern(this.AllowOnlyNumbers)]
    }),
    quantityFree: new FormControl('0', {
      updateOn: 'blur',
      validators: [Validators.required, Validators.pattern(this.AllowOnlyNumbers)]
    }),
    purchasePriceBeforeDiscount: new FormControl('0', {
      updateOn: 'blur',
      validators: [Validators.required, Validators.pattern(this.AllowOnlyNumbersAndTwoDecimalPoint)]
    }),
    discountPrice: new FormControl('0', {
      updateOn: 'blur',
      validators: [Validators.required, Validators.pattern(this.AllowOnlyNumbersAndTwoDecimalPoint)]
    }),
    purchasePriceAfterDiscount: new FormControl({ value: '0', disabled: true }, {
      updateOn: 'blur',
      validators: [Validators.required, Validators.pattern(this.AllowOnlyNumbersAndTwoDecimalPoint)]
    }),
    gst: new FormControl('5', { updateOn: 'blur', validators: [Validators.required] }),
  });


  totalQuantityPiece = 0;
  taxAmount: number = 0;
  totalPrice: number = 0;
  purchasePricePerPiece: number = 0;


  purchasePriceBeforeDiscount: number = 0
  purchasePriceAfterDiscount: number = 0

  ngOnInit(): void {
    if (this.item.isEdit) {
      // if in edit mode
      this.newItemPurchaseFormGroup.setValue({
        mrp: this.item.item.mrp,
        quantityBox: this.item.item.quantityBox,
        piecePerCarton: this.item.item.piecePerCarton,
        quantityPiece: this.item.item.quantityPiece,
        quantityFree: this.item.item.quantityFree,
        purchasePriceBeforeDiscount: this.item.item.purchasePriceBeforeDiscount,
        discountPrice: this.item.item.discountPrice,
        purchasePriceAfterDiscount: this.item.item.purchasePriceAfterDiscount,
        gst: this.item.item.gst,
      });

      this.purchasePriceAfterDiscount = this.item.item.purchasePriceAfterDiscount;
      this.purchasePriceBeforeDiscount = this.item.item.purchasePriceBeforeDiscount;
      this.totalQuantityPiece = this.item.item.totalQuantityPiece;
      this.taxAmount = this.item.item.taxAmount;
      this.totalPrice = this.item.item.totalPrice;
      this.purchasePricePerPiece = +this.item.item.purchasePricePerPiece.toFixed(2);
    }


    this.newItemPurchaseFormGroup.valueChanges
      .pipe(filter(() => this.newItemPurchaseFormGroup.valid), debounceTime(500))
      .subscribe({
        next: () => {
          // console.log(val)
          const val = this.newItemPurchaseFormGroup.getRawValue();
          this.calculateDiscount(val);
          this.totalQuantityPiece = (+val.quantityBox * +val.piecePerCarton) + +val.quantityPiece + +val.quantityFree;
          this.taxAmount = +(+this.purchasePriceAfterDiscount * (+val.gst / 100)).toFixed(2);
          this.totalPrice = +(+this.purchasePriceAfterDiscount + +this.taxAmount).toFixed(2);
          this.purchasePricePerPiece = +(+this.totalPrice / +this.totalQuantityPiece).toFixed(2);
        }
      })
  }


  calculateDiscount(val: any) {
    if (!this.enable) {
      const ppad = +val.purchasePriceBeforeDiscount - +val.discountPrice;
      // this.newItemPurchaseFormGroup.get('purchasePriceAfterDiscount')?.setValue(ppad, { onlySelf: true, emitEvents:false });
      console.log(typeof val.purchasePriceBeforeDiscount)
      this.purchasePriceBeforeDiscount = +Number(val.purchasePriceBeforeDiscount).toFixed(2);
      this.purchasePriceAfterDiscount = +Number(ppad).toFixed(2);
    } else {
      const ppbd = +val.purchasePriceAfterDiscount + +val.discountPrice;
      this.purchasePriceAfterDiscount = +Number(val.purchasePriceAfterDiscount).toFixed(2);
      // this.newItemPurchaseFormGroup.get('purchasePriceBeforeDiscount')?.setValue(ppbd, { onlySelf: true, emitEvents: false });
      this.purchasePriceBeforeDiscount = +Number(ppbd).toFixed(2);
    }
  }




  onAdd(): void {
    // console.log(this.newItemPurchaseFormGroup.value);
    // console.log(this.newItemPurchaseFormGroup);

    if (!this.validatePurchase()) {
      return;
    }

    if (this.validatePurchase()) {
      this._dialogRef.close({
        isEdit: this.item.isEdit,
        shouldAdd: true,
        item: {
          ...this.item.item,
          mrp: this.newItemPurchaseFormGroup.getRawValue().mrp,
          quantityBox: this.newItemPurchaseFormGroup.getRawValue().quantityBox,
          piecePerCarton: this.newItemPurchaseFormGroup.getRawValue().piecePerCarton,
          quantityPiece: this.newItemPurchaseFormGroup.getRawValue().quantityPiece,
          quantityFree: this.newItemPurchaseFormGroup.getRawValue().quantityFree,
          purchasePriceBeforeDiscount: this.purchasePriceBeforeDiscount,
          discountPrice: this.newItemPurchaseFormGroup.getRawValue().discountPrice,
          purchasePriceAfterDiscount: this.purchasePriceAfterDiscount,
          gst: this.newItemPurchaseFormGroup.getRawValue().gst,
          totalQuantityPiece: this.totalQuantityPiece,
          taxAmount: this.taxAmount,
          totalPrice: this.totalPrice,
          purchasePricePerPiece: this.purchasePricePerPiece,
        }
      })
    }

  }

  validatePurchase(): boolean {
    if (+this.newItemPurchaseFormGroup.getRawValue().mrp === 0 &&
      +this.newItemPurchaseFormGroup.getRawValue().quantityBox === 0 &&
      +this.newItemPurchaseFormGroup.getRawValue().piecePerCarton === 0 &&
      +this.newItemPurchaseFormGroup.getRawValue().quantityPiece === 0 &&
      +this.newItemPurchaseFormGroup.getRawValue().quantityFree === 0 &&
      +this.purchasePriceBeforeDiscount === 0 &&
      +this.newItemPurchaseFormGroup.getRawValue().discountPrice === 0 &&
      +this.purchasePriceAfterDiscount === 0) {
      this._popupService.openAlert({
        header: 'Alert',
        message: 'All the values cannot be 0(zero).'
      })
      return false;
    } else if (+this.newItemPurchaseFormGroup.getRawValue().mrp === 0) {
      this._popupService.openAlert({
        header: 'Alert',
        message: 'MRP cannot be 0(zero).'
      })
      return false;
    } else if (+this.purchasePriceBeforeDiscount === 0) {
      this._popupService.openAlert({
        header: 'Alert',
        message: 'Purchase price before discount cannot be 0(zero).'
      })
      return false;
    } else if (+this.purchasePriceAfterDiscount === 0) {
      this._popupService.openAlert({
        header: 'Alert',
        message: 'Purchase price after discount cannot be 0(zero).'
      })
      return false;
    }
    else if (+this.newItemPurchaseFormGroup.getRawValue().quantityBox !== 0 && +this.newItemPurchaseFormGroup.getRawValue().piecePerCarton === 0) {
      this._popupService.openAlert({
        header: 'Alert',
        message: 'Please enter piece per carton.'
      })
      return false;
    }
    else if (+this.totalQuantityPiece === 0) {
      this._popupService.openAlert({
        header: 'Alert',
        message: 'Please enter box quantity and piece per box or piece quantity.'
      })
      return false;
    }
    else {
      return true;
    }

  }

  onCancel(): void {
    this._dialogRef.close({
      shouldAdd: false
    })
  }


  getValue(controlName: string): string {
    const control = this.newItemPurchaseFormGroup.get(controlName) as AbstractControl;
    return control.valid ? control.value : 0;
  }


  getErrorMessage(controlName: string): string | null {
    const control = this.newItemPurchaseFormGroup.get(controlName) as AbstractControl;
    if (control.hasError('required')) {
      if (controlName === 'mrp') return 'Please enter MRP!';
      if (controlName === 'quantityBox') return 'Please enter box/carton!';
      if (controlName === 'piecePerCarton') return 'This field is required!';
      if (controlName === 'quantityPiece') return 'Please enter piece(s)!';
      if (controlName === 'purchasePriceBeforeDiscount') return 'Please enter total price!';
      if (controlName === 'quantityFree') return 'Please enter free quantity!';
      if (controlName === 'discountPrice') return 'This field is required!';
      if (controlName === 'purchasePriceAfterDiscount') return 'This field is required!';
      if (controlName === 'gst') return 'Please choose GST rate!';
    } else if (control.hasError('pattern')) {
      if (controlName === 'mrp') return 'Invalid value!';
      if (controlName === 'quantityBox') return 'Invalid value!';
      if (controlName === 'piecePerCarton') return 'Invalid value!';
      if (controlName === 'quantityPiece') return 'Invalid value!';
      if (controlName === 'purchasePriceBeforeDiscount') return 'Invalid value!';
      if (controlName === 'purchasePriceAfterDiscount') return 'Invalid value!';
      if (controlName === 'quantityFree') return 'Invalid value!';
      if (controlName === 'discountPrice') return 'Invalid value!';
    }
    return null;
  }


  onDiscountTypeChange(e: MatSlideToggleChange) {
    this.enable = e.checked;
    if (e.checked) {
      this.newItemPurchaseFormGroup.get('purchasePriceAfterDiscount')?.enable();
      this.newItemPurchaseFormGroup.get('purchasePriceBeforeDiscount')?.disable();
    } else {
      this.newItemPurchaseFormGroup.get('purchasePriceAfterDiscount')?.disable();
      this.newItemPurchaseFormGroup.get('purchasePriceBeforeDiscount')?.enable();
    }
  }

}



// when before changes change after
// when after changes change before
// when discount changes changes change only after 1863.79 