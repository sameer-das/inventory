import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { StockRoutingModule } from './stock-router.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material.module';
import { NewBrandComponent } from './new-brand/new-brand.component';
import { NewItemComponent } from './new-item/new-item.component';
import { NewCategoryComponent } from './new-category/new-category.component';
import { ListStockComponent } from './list-stock/list-stock.component';
import { StockService } from './stock.service';
import { HttpClientModule } from '@angular/common/http';
import { ItemStockDetailsComponent } from '../popups/item-stock-details/item-stock-details.component';
import { ListStockBrandWiseComponent } from './list-stock-brand-wise/list-stock-brand-wise.component';



@NgModule({
  declarations: [
    NewBrandComponent,
    NewItemComponent,
    NewCategoryComponent,
    ListStockComponent,
    ItemStockDetailsComponent,
    ListStockBrandWiseComponent,

  ],
  imports: [
    CommonModule,
    StockRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    HttpClientModule
  ],
  providers: [StockService]
})
export class StockModule { }
