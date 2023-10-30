import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { APIResponse } from '../apiresponse';

@Injectable()
export class SaleService {

  constructor(private _http: HttpClient) { }


  saveSale(sale: any) {
    return this._http.post<APIResponse>(environment.API_BASE_URL + '/sale', sale)
  }

  getNextBillNo() {
    return this._http.get<APIResponse>(environment.API_BASE_URL + '/sale/bill-number')
  }


  getAllSales() {
    return this._http.get<APIResponse>(environment.API_BASE_URL + '/sale/all')
  }

  getSaleDetails(saleUid:string) {
    return this._http.get<APIResponse>(environment.API_BASE_URL + `/sale/sale-details?saleUid=${saleUid}`)
  }
  
  getGstDetailsOfSale(saleUid:string) {
    return this._http.get<APIResponse>(environment.API_BASE_URL + `/sale/gst-details?saleUid=${saleUid}`)
  }
}
