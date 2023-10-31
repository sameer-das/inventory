import { NgModule, inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterModule, RouterStateSnapshot, Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { LoginComponent } from './login/login.component';
import { AuthGuardService } from './services/auth-guard.service';



const canActivateRoute: CanActivateFn =
  (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    const _authGuardService: AuthGuardService = inject(AuthGuardService);
    const router: Router = inject(Router);
    if (_authGuardService.isLoggedIn(localStorage.getItem('auth-token') || '')) {
      return true; // if logged in return true
    } else {
      return router.createUrlTree(['/', 'login']); // if logged in return url tree to login
    }
  };

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '', component: LayoutComponent,
    children: [
      { path: '', redirectTo: 'sale', pathMatch: 'full' }, // redirect to sale page if empty found
      {
        path: 'sale',
        loadChildren: () => import('./sale/sale.module').then((m) => m.SaleModule),
        canActivate: [canActivateRoute]
      },
      {
        path: 'purchase',
        loadChildren: () => import('./purchase/purchase.module').then((m) => m.PurchaseModule),
        canActivate: [canActivateRoute]
      },
      {
        path: 'stock',
        loadChildren: () => import('./stock/stock.module').then((m) => m.StockModule),
        canActivate: [canActivateRoute]
      },
      {
        path: 'relations',
        loadChildren: () => import('./realations/relations.module').then((m) => m.RelationsModule),
        canActivate: [canActivateRoute]
      }
    ]
  },
];



@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
