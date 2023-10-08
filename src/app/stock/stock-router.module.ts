import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListStockComponent } from './list-stock/list-stock.component';
import { NewBrandComponent } from './new-brand/new-brand.component';
import { NewCategoryComponent } from './new-category/new-category.component';
import { NewItemComponent } from './new-item/new-item.component';


const routes: Routes = [
    { path: '', component: ListStockComponent },
    { path: 'newbrand', component: NewBrandComponent },
    { path: 'newcategory', component: NewCategoryComponent },
    { path: 'newitem', component: NewItemComponent },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class StockRoutingModule { }
