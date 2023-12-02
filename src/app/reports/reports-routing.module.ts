import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SaleReportsComponent } from './sale-reports/sale-reports.component';
import { PurchaseReportsComponent } from './purchase-reports/purchase-reports.component';
import { StockReportComponent } from './stock-report/stock-report.component';
import { ProfitReportComponent } from './profit-report/profit-report.component';


const routes: Routes = [
    { path: 'sale-reports', component: SaleReportsComponent },
    { path: 'purchase-reports', component: PurchaseReportsComponent, },
    { path: 'stock-reports', component: StockReportComponent, },
    { path: 'profit-reports', component: ProfitReportComponent, },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ReportsRoutingModule { }
