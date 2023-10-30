import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerComponent } from './customer/customer.component';
import { BillerComponent } from './biller/biller.component';


const routes: Routes = [
    { path: 'my-customers', component: CustomerComponent },
    { path: 'my-billers', component: BillerComponent},
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RelationsRoutingModule { }
