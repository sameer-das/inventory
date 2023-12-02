import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { APIResponse } from '../apiresponse';
import { environment } from 'src/environments/environment';
@Injectable()
export class ReportsService {

  constructor(private _http: HttpClient) { }
  private API_BASE_URL: string = environment.API_BASE_URL;

  getBrands() {
    return this._http.get<APIResponse>(`${this.API_BASE_URL}/brands?status=1`);
  }

  getStockReportBrandWise(brandId: number) {
    return this._http.get<APIResponse>(`${this.API_BASE_URL}/reports/current-stock-brand?brandId=${brandId}`);
  }
  getSaleReport(reportType: number, startDate: string, endDate: string, reportCustomerName?: string, reportItemId?: number) {
    if (reportType === 2) {
      return this._http.get<APIResponse>(`${this.API_BASE_URL}/reports/sale-report?reportType=${reportType}&reportCustomerName=${reportCustomerName}&startDate=${startDate}&endDate=${endDate}`);
    } else if (reportType === 3) {
      return this._http.get<APIResponse>(`${this.API_BASE_URL}/reports/sale-report?reportType=${reportType}&reportItemId=${reportItemId}&startDate=${startDate}&endDate=${endDate}`);
    } else { // for reportType === 1
      return this._http.get<APIResponse>(`${this.API_BASE_URL}/reports/sale-report?reportType=${reportType}&startDate=${startDate}&endDate=${endDate}`);
    }
  }


  getProfitReport(reportType: number, startDate: string, endDate: string, brandId?: number) {
    if (reportType === 2) {
      return this._http.get<APIResponse>(`${this.API_BASE_URL}/reports/profit-report?reportType=${reportType}&startDate=${startDate}&endDate=${endDate}&brandId=${brandId}`);
    } else { // for reportType === 1
      return this._http.get<APIResponse>(`${this.API_BASE_URL}/reports/profit-report?reportType=${reportType}&startDate=${startDate}&endDate=${endDate}`);
    }
  }
}