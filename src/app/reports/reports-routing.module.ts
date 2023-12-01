import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SaleReportsComponent } from './sale-reports/sale-reports.component';
import { PurchaseReportsComponent } from './purchase-reports/purchase-reports.component';
import { StockReportComponent } from './stock-report/stock-report.component';


const routes: Routes = [
    { path: 'sale-reports', component: SaleReportsComponent },
    { path: 'purchase-reports', component: PurchaseReportsComponent, },
    { path: 'stock-reports', component: StockReportComponent, }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ReportsRoutingModule { }
