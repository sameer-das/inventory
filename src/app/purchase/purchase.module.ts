import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PurchaseRoutingModule } from './purchase-routing.module';
import { MaterialModule } from '../material.module';
import { NewPurchaseComponent } from './new-purchase/new-purchase.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SearchItemModule } from '../search-item/search-item.module';
import { NewPurchasePopupComponent } from '../popups/new-purchase-popup/new-purchase-popup.component';



@NgModule({
  declarations: [
    NewPurchaseComponent,
    NewPurchasePopupComponent
  ],
  imports: [
    CommonModule,
    PurchaseRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    SearchItemModule
  ]
})
export class PurchaseModule { }
