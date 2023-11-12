import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SaleRoutingModule } from './sale-routing.module';
import { SearchItemModule } from '../search-item/search-item.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NewSaleComponent } from './new-sale/new-sale.component';
import { MaterialModule } from '../material.module';
import { NewSalePopupComponent } from '../popups/new-sale-popup/new-sale-popup.component';
import { HttpClientModule } from '@angular/common/http';
import { SaleService } from './sale.service';
import { ListSalesComponent } from './list-sales/list-sales.component';
import { SaleDetailsComponent } from './sale-details/sale-details.component';
import { RelationsModule } from '../realations/relations.module';
import { EditSaleComponent } from './edit-sale/edit-sale.component';



@NgModule({
  declarations: [
    NewSaleComponent,
    NewSalePopupComponent,
    ListSalesComponent,
    SaleDetailsComponent,
    EditSaleComponent
  ],
  imports: [
    CommonModule,
    SaleRoutingModule,
    SearchItemModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MaterialModule,
    RelationsModule
  ],
  providers: [SaleService]
})
export class SaleModule { }
