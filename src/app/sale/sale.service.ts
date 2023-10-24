import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable()
export class SaleService {

  constructor(private _http: HttpClient) { }


  saveSale(sale: any) {
    return this._http.post(environment.API_BASE_URL + '/sale', sale)
  }
}
