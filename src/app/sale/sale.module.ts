import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SaleRoutingModule } from './sale-routing.module';
import { SearchItemModule } from '../search-item/search-item.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NewSaleComponent } from './new-sale/new-sale.component';
import { MaterialModule } from '../material.module';
import { NewSalePopupComponent } from '../popups/new-sale-popup/new-sale-popup.component';


@NgModule({
  declarations: [
    NewSaleComponent,
    NewSalePopupComponent
  ],
  imports: [
    CommonModule,
    SaleRoutingModule,
    SearchItemModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule
  ]
})
export class SaleModule { }
