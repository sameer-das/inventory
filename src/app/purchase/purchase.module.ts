import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PurchaseRoutingModule } from './purchase-routing.module';
import { MaterialModule } from '../material.module';
import { NewPurchaseComponent } from './new-purchase/new-purchase.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SearchItemModule } from '../search-item/search-item.module';
import { NewPurchasePopupComponent } from '../popups/new-purchase-popup/new-purchase-popup.component';
import { PurchaseService } from './purchase.service';
import { HttpClientModule } from '@angular/common/http';



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
    SearchItemModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [PurchaseService]
})
export class PurchaseModule { }
