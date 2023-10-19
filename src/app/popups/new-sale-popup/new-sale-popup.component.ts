import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-new-sale-popup',
  templateUrl: './new-sale-popup.component.html',
  styleUrls: ['./new-sale-popup.component.scss']
})
export class NewSalePopupComponent implements OnInit, OnDestroy {

  constructor(@Inject(MAT_DIALOG_DATA) public item: any, private _dialogRef: MatDialogRef<NewSalePopupComponent>) { }

  private destroy$: Subject<boolean> = new Subject<boolean>();
  private AllowOnlyNumbersAndTwoDecimalPoint = /^[0-9][0-9]*[.]?[0-9]{0,2}$/;
  private AllowOnlyNumbers = /^[0-9]+$/;

  stockArray: any[] = [];

  itemLinesGroup!: FormGroup;

  ngOnInit(): void {
    console.log(this.item);

    this.item.item.stock = this.item.item.stock.map((item: any) => {
      return {
        ...item,
        totalSaleQuantity: 0,
        totalAmount: 0
      }
    })

    this.stockArray = this.item.item.stock;


    if (this.stockArray.length > 0) {
      this.itemLinesGroup = new FormGroup({
        lines: new FormArray(this.stockArray.map(curr => this.getFormArrayElement(curr)))
      });
      this.itemLinesGroup.valueChanges.subscribe((val) => {
        this.calculate(val)
      })
    }
  }
  ngOnDestroy(): void {

  }

  getFormArrayElement(item?: any) {
    return new FormGroup({
      itemDetails: new FormControl({
        item_name: item.item_name,
        piecePerCarton: item.piece_per_carton,
        gst: 5,
        totalQuantity: item.total_quantity_piece,
        purchasePricePerPiece: item.purchase_price_per_piece,
        purchaseDate: item.purchase_date,
        totalSaleQuantity: item.totalSaleQuantity,
        totalAmount: item.totalAmount,
      }),
      quantityBox: new FormControl(0, { updateOn: 'blur', validators: [Validators.required, Validators.pattern(this.AllowOnlyNumbers)] }),
      pricePerBox: new FormControl(0, { updateOn: 'blur', validators: [Validators.required, Validators.pattern(this.AllowOnlyNumbersAndTwoDecimalPoint)] }),
      quantityPiece: new FormControl(0, { updateOn: 'blur', validators: [Validators.required, Validators.pattern(this.AllowOnlyNumbers)] }),
      pricePerPiece: new FormControl(0, { updateOn: 'blur', validators: [Validators.required, Validators.pattern(this.AllowOnlyNumbersAndTwoDecimalPoint)] }),
      quantityFree: new FormControl(0, { updateOn: 'blur' }),
      // salePrice: new FormControl(0, { updateOn: 'blur', validators: [Validators.required, Validators.pattern(this.AllowOnlyNumbersAndTwoDecimalPoint)] }),
    })
  }


  get getItemsArray(): AbstractControl[] {
    // array of formgroups
    return (<FormArray>this.itemLinesGroup.get('lines')).controls;
  }

  add() {
    this._dialogRef.close({
      isAdd: true,
      item: {
        item_name: this.item.item.item_name,
        mrp: this.item.item.mrp,
        qtyBox: this.totalBoxQuantity,
        qtyPiece: this.totalPieceQuantity,
        qtyTotalPiece: this.totalQuantity,
        totalAmount: this.totalAmount,
        stocks: this.itemLinesGroup.value
      }
    })
  }

  totalBoxQuantity: number = 0;
  totalPieceQuantity: number = 0;
  totalQuantity: number = 0;
  totalAmount: number = 0;
  averageBoxPrice: number = 0;
  averagePiecePrice: number = 0;

  calculate(val: any) {
    console.log(val);
    this.totalBoxQuantity = 0;
    this.totalPieceQuantity = 0;
    this.totalQuantity = 0;
    this.totalAmount = 0;
    this.averageBoxPrice = 0;
    this.averagePiecePrice = 0;

    let qtyBox_X_boxPrice = 0;
    let total_box_qty = 0;
    let qtyPiece_X_piecePrice = 0;
    let total_piece_qty = 0;
    val.lines.forEach((line: any) => {
      const pieceFromBox = (+line.quantityBox * +line.itemDetails.piecePerCarton);
      const priceForBox = +line.quantityBox * +line.pricePerBox;

      line.itemDetails.totalSaleQuantity = pieceFromBox + +line.quantityPiece;

      line.itemDetails.totalAmount = priceForBox + (+line.quantityPiece * +line.pricePerPiece)



      this.totalBoxQuantity += +line.quantityBox;
      this.totalPieceQuantity += +line.quantityPiece;
      this.totalQuantity += (pieceFromBox + +line.quantityPiece);
      this.totalAmount += line.itemDetails.totalAmount;

      qtyBox_X_boxPrice += +line.quantityBox * +line.pricePerBox;
      total_box_qty += +line.quantityBox;

      qtyPiece_X_piecePrice += +line.quantityPiece * +line.pricePerPiece;
      total_piece_qty += +line.quantityPiece
    });

    this.averageBoxPrice = isNaN(+((qtyBox_X_boxPrice / total_box_qty).toFixed(2))) ? 0 : +((qtyBox_X_boxPrice / total_box_qty).toFixed(2));
    this.averagePiecePrice = isNaN(+((qtyPiece_X_piecePrice / total_piece_qty).toFixed(2))) ? 0 : +((qtyPiece_X_piecePrice / total_piece_qty).toFixed(2));

  }
}
