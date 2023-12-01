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

  getStockReportBrandWise(brandId:number) {
    return this._http.get<APIResponse>(`${this.API_BASE_URL}/reports/current-stock-brand?brandId=${brandId}`);
  }
}