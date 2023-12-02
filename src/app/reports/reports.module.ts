import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SaleReportsComponent } from './sale-reports/sale-reports.component';
import { PurchaseReportsComponent } from './purchase-reports/purchase-reports.component';
import { ReportsRoutingModule } from './reports-routing.module';
import { MaterialModule } from '../material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { StockReportComponent } from './stock-report/stock-report.component';
import { ReportsService } from './reports.service';
import { SearchItemModule } from '../search-item/search-item.module';
import { ProfitReportComponent } from './profit-report/profit-report.component';



@NgModule({
  declarations: [
    SaleReportsComponent,
    PurchaseReportsComponent,
    StockReportComponent,
    ProfitReportComponent
  ],
  imports: [
    CommonModule,
    ReportsRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    SearchItemModule
  ],
  providers: [ReportsService]
})
export class ReportsModule { }
