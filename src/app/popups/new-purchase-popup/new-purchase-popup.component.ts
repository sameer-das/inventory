import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { debounceTime, filter } from 'rxjs';

@Component({
  selector: 'app-new-purchase-popup',
  templateUrl: './new-purchase-popup.component.html',
  styleUrls: ['./new-purchase-popup.component.scss']
})
export class NewPurchasePopupComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public item: any, private _dialogRef: MatDialogRef<NewPurchasePopupComponent>) { }


  AllowOnlyNumbersAndTwoDecimalPoint = /^[0-9][0-9]*[.]?[0-9]{0,2}$/;
  AllowOnlyNumbers = /^[0-9]+$/;

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
    purchasePriceBeforeDiscount: new FormControl('0.00', {
      updateOn: 'blur',
      validators: [Validators.required, Validators.pattern(this.AllowOnlyNumbersAndTwoDecimalPoint)]
    }),
    discountPrice: new FormControl('0.00', {
      updateOn: 'blur',
      validators: [Validators.required, Validators.pattern(this.AllowOnlyNumbersAndTwoDecimalPoint)]
    }),
    purchasePriceAfterDiscount: new FormControl('0.00', {
      updateOn: 'blur',
      validators: [Validators.required, Validators.pattern(this.AllowOnlyNumbersAndTwoDecimalPoint)]
    }),
    gst: new FormControl('5', { updateOn: 'blur', validators: [Validators.required] }),
  });


  totalQuantityPiece = 0;
  taxAmount = '0';
  totalPrice = '0';
  purchasePricePerPiece = '0';

  ppbd: string = '0';
  ppad: string = '0';
  discountPrice: string = '0';

  ngOnInit(): void {
    this.newItemPurchaseFormGroup.valueChanges
      .pipe(filter(() => this.newItemPurchaseFormGroup.valid), debounceTime(500))
      .subscribe({
        next: (val) => {
          console.log(val)
          if (val.purchasePriceBeforeDiscount !== this.ppbd) {// check with previous value
            // ppbd changed
            this.ppbd = val.purchasePriceBeforeDiscount;
            const ppad = (+val.purchasePriceBeforeDiscount - +val.discountPrice).toFixed(2);
            this.newItemPurchaseFormGroup.get('purchasePriceAfterDiscount')?.setValue(ppad === '0.00' ? '0' : ppad, { onlySelf: true })

          } else if (val.purchasePriceAfterDiscount !== this.ppad) {// check with previous value
            // ppad changed
            this.ppad = val.purchasePriceAfterDiscount;
            const ppbd = (+val.purchasePriceAfterDiscount + +val.discountPrice).toFixed(2);
            this.newItemPurchaseFormGroup.get('purchasePriceBeforeDiscount')?.setValue(ppbd === '0.00' ? '0' : ppbd, { onlySelf: true })

          } else if (val.discountPrice !== this.discountPrice) {// check with previous value
            // discount price changed

            const ppad = (+val.purchasePriceBeforeDiscount - +val.discountPrice).toFixed(2);
            const ppbd = (+val.purchasePriceAfterDiscount + +val.discountPrice).toFixed(2);
            this.newItemPurchaseFormGroup.get('purchasePriceAfterDiscount')?.setValue(ppad === '0.00' ? '0' : ppad, { onlySelf: true });
            this.newItemPurchaseFormGroup.get('purchasePriceBeforeDiscount')?.setValue(ppbd === '0.00' ? '0' : ppbd, { onlySelf: true });
          }


          this.totalQuantityPiece = (+val.quantityBox * +val.piecePerCarton) + +val.quantityPiece + +val.quantityFree;
          this.taxAmount = (+val.purchasePriceAfterDiscount * (+val.gst / 100)).toFixed(2);
          this.totalPrice = (+val.purchasePriceAfterDiscount + +this.taxAmount).toFixed(2);
          this.purchasePricePerPiece = (+this.totalPrice / +this.totalQuantityPiece).toFixed(2);
        }
      })
  }



  onAdd(): void {
    console.log(this.newItemPurchaseFormGroup.value);
    console.log(this.newItemPurchaseFormGroup);
    this._dialogRef.close({
      shouldAdd: true,
      item: {
        mrp: this.newItemPurchaseFormGroup.value.mrp,
        quantityBox: this.newItemPurchaseFormGroup.value.quantityBox,
        piecePerCarton: this.newItemPurchaseFormGroup.value.piecePerCarton,
        quantityPiece: this.newItemPurchaseFormGroup.value.quantityPiece,
        quantityFree: this.newItemPurchaseFormGroup.value.quantityFree,
        purchasePriceBeforeDiscount: this.newItemPurchaseFormGroup.value.purchasePriceBeforeDiscount,
        discountPrice: this.newItemPurchaseFormGroup.value.discountPrice,
        purchasePriceAfterDiscount: this.newItemPurchaseFormGroup.value.purchasePriceAfterDiscount,
        gst: this.newItemPurchaseFormGroup.value.gst,
        totalQuantityPiece: this.totalQuantityPiece,
        taxAmount: this.taxAmount,
        totalPrice: this.totalPrice,
        purchasePricePerPiece: this.purchasePricePerPiece
      }
    })
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
}
