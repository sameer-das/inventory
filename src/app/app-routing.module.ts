import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { LayoutComponent } from './layout/layout.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '', component: LayoutComponent,
    children: [
      { path: '', redirectTo: 'sale', pathMatch:'full' }, // redirect to sale page if empty found
      { path: 'sale', loadChildren: () => import('./sale/sale.module').then((m) => m.SaleModule) },
      { path: 'purchase', loadChildren: () => import('./purchase/purchase.module').then((m) => m.PurchaseModule) },
      { path: 'stock', loadChildren: () => import('./stock/stock.module').then((m) => m.StockModule) }
    ]
  },
];



@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
