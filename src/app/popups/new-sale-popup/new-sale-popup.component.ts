import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-new-sale-popup',
  templateUrl: './new-sale-popup.component.html',
  styleUrls: ['./new-sale-popup.component.scss']
})
export class NewSalePopupComponent implements OnInit, OnDestroy {
  constructor(){

  }

  private destroy$: Subject<boolean> = new Subject<boolean>();
  arr: number[] = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25]
  
  ngOnInit(): void {
    // throw new Error('Method not implemented.');
  }
  ngOnDestroy(): void {
    // throw new Error('Method not implemented.');
  }

}
