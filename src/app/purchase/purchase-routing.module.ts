import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NewPurchaseComponent } from './new-purchase/new-purchase.component';
import { ListPurchasesComponent } from './list-purchases/list-purchases.component';
import { PurchaseDetailsComponent } from './purchase-details/purchase-details.component';

const routes: Routes = [
    { path: '', component: NewPurchaseComponent },
    { path: 'list-purchases', component: ListPurchasesComponent },
    { path: 'purchase-details/:purchase_uid', component: PurchaseDetailsComponent },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PurchaseRoutingModule { }
