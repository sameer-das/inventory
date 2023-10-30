import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { APIResponse } from '../apiresponse';

@Injectable({
  providedIn: 'root'
})
export class RealtionsService {

  constructor(private _http: HttpClient) { }

  private API_BASE_URL: string = environment.API_BASE_URL;

  addBiller(biller: any) {
    return this._http.post<APIResponse>(`${this.API_BASE_URL}/relations/biller`, biller);
  }
  addCustomer(customer: any) {
    return this._http.post<APIResponse>(`${this.API_BASE_URL}/relations/customer`, customer);
  }
  getBiller() {
    return this._http.get<APIResponse>(`${this.API_BASE_URL}/relations/biller`);
  }
  getCustomer() {
    return this._http.get<APIResponse>(`${this.API_BASE_URL}/relations/customer`);
  }
}
