import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { APIResponse } from '../apiresponse';
import { environment } from 'src/environments/environment';
@Injectable()
export class PurchaseService {

  constructor(private _http: HttpClient) { }
  private API_BASE_URL: string = environment.API_BASE_URL;

  addPurchase(purchasePayload: any) {
    return this._http.post<APIResponse>(`${this.API_BASE_URL}/purchase`, purchasePayload);
  }

  getAllPurchase(pageNo: number, pageSize: number) {
    return this._http.get<APIResponse>(`${this.API_BASE_URL}/purchase?page=${pageNo}&pageSize=${pageSize}`);
  }

  getPurchaseDetails(purchaseUid:string) {
    return this._http.get<APIResponse>(`${this.API_BASE_URL}/purchase/details?purchase_uid=${purchaseUid}`);

  }
}
