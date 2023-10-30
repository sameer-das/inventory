import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NewSaleComponent } from './new-sale/new-sale.component';
import { ListSalesComponent } from './list-sales/list-sales.component';
import { SaleDetailsComponent } from './sale-details/sale-details.component';

const routes: Routes = [
    { path: '', component: NewSaleComponent },
    { path: 'list-sales', component: ListSalesComponent },
    { path: 'sale-details/:sale_uid', component: SaleDetailsComponent },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SaleRoutingModule { }
