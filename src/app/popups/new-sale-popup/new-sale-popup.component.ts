import { Component, OnInit, OnDestroy } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-new-sale-popup',
  templateUrl: './new-sale-popup.component.html',
  styleUrls: ['./new-sale-popup.component.scss']
})
export class NewSalePopupComponent implements OnInit, OnDestroy {
  constructor() {

  }

  private destroy$: Subject<boolean> = new Subject<boolean>();
  private AllowOnlyNumbersAndTwoDecimalPoint = /^[0-9][0-9]*[.]?[0-9]{0,2}$/;
  private AllowOnlyNumbers = /^[0-9]+$/;

  arr: any[] = [
    {
      item_name: 'Kitkat Rs.20',
      piecePerCarton: 20,
      gst: 5,
      totalQuantity: 500,
      purchasePricePerPiece: 18.50,
      purchaseDate: '20-08-2023',
      totalSaleQuantity: 0,
      totalAmount: 0,
    },
    {
      item_name: 'Kitkat Rs.20',
      piecePerCarton: 20,
      gst: 5,
      totalQuantity: 200,
      purchasePricePerPiece: 19,
      purchaseDate: '10-07-2023',
      totalSaleQuantity: 0,
      totalAmount: 0,

    },
    {
      item_name: 'Kitkat Rs.20',
      piecePerCarton: 20,
      gst: 5,
      totalQuantity: 300,
      purchasePricePerPiece: 18.00,
      purchaseDate: '15-06-2023',
      totalSaleQuantity: 0,
      totalAmount: 0,
    }
  ]

  itemLinesGroup!: FormGroup;

  ngOnInit(): void {
    this.itemLinesGroup = new FormGroup({
      lines: new FormArray(this.arr.map(curr => this.getFormArrayElement(curr)))
    });
    this.itemLinesGroup.valueChanges.subscribe((val) => {
      this.calculate(val)
    })
    // console.log(this.getItemsArray[0].get('itemDetails'))
  }
  ngOnDestroy(): void {

  }

  getFormArrayElement(item?: any) {
    return new FormGroup({
      itemDetails: new FormControl({
        item_name: item.item_name,
        piecePerCarton: item.piecePerCarton,
        gst: item.gst,
        totalQuantity: item.totalQuantity,
        purchasePricePerPiece: item.purchasePricePerPiece,
        purchaseDate: item.purchaseDate,
        totalSaleQuantity: item.totalSaleQuantity,
        totalAmount: item.totalAmount,
      }),
      quantityBox: new FormControl(0, { updateOn: 'blur', validators: [Validators.required, Validators.pattern(this.AllowOnlyNumbers)] }),
      pricePerBox: new FormControl(0, { updateOn: 'blur', validators: [Validators.required, Validators.pattern(this.AllowOnlyNumbers)] }),
      quantityPiece: new FormControl(0, { updateOn: 'blur', validators: [Validators.required, Validators.pattern(this.AllowOnlyNumbers)] }),
      pricePerPiece: new FormControl(0, { updateOn: 'blur', validators: [Validators.required, Validators.pattern(this.AllowOnlyNumbers)] }),
      quantityFree: new FormControl(0, { updateOn: 'blur' }),
      // salePrice: new FormControl(0, { updateOn: 'blur', validators: [Validators.required, Validators.pattern(this.AllowOnlyNumbersAndTwoDecimalPoint)] }),
    })
  }


  get getItemsArray(): AbstractControl[] {
    // array of formgroups
    return (<FormArray>this.itemLinesGroup.get('lines')).controls;
  }

  addRows() {
    this.getItemsArray.push(this.getFormArrayElement())
  }

  totalBoxQuantity: number = 0;
  totalPieceQuantity: number = 0;
  totalQuantity: number = 0;
  totalAmount: number = 0;

  calculate(val: any) {
    console.log(val);
    this.totalBoxQuantity = 0;
    this.totalPieceQuantity = 0;
    this.totalQuantity = 0;
    this.totalAmount = 0;
    val.lines.forEach((line: any) => {
      const pieceFromBox = (+line.quantityBox * +line.itemDetails.piecePerCarton);
      const priceForBox = +line.quantityBox * +line.pricePerBox;

      line.itemDetails.totalQuantity =  pieceFromBox + +line.quantityPiece;

      line.itemDetails.totalAmount = priceForBox + (+line.quantityPiece * +line.pricePerPiece)

     

      this.totalBoxQuantity += +line.quantityBox;
      this.totalPieceQuantity += +line.quantityPiece;
      this.totalQuantity += (pieceFromBox + +line.quantityPiece);
      this.totalAmount +=  line.itemDetails.totalAmount;
    });
  }
}
