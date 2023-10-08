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



@NgModule({
  declarations: [
    NewBrandComponent,
    NewItemComponent,
    NewCategoryComponent,
    ListStockComponent
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
