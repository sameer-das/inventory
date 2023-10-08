import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { APIResponse } from '../apiresponse';

@Injectable()
export class StockService {

  constructor(private _http: HttpClient) { }

  private HOST_API: string = 'http://localhost:3000/api/v1';

  getBrands() {
    return this._http.get<APIResponse>(`${this.HOST_API}/brands?status=1`);
  }

  createBrand(brandname: string) {
    return this._http.post<APIResponse>(`${this.HOST_API}/brands`, { brandname })
  }



  getCategories() {
    return this._http.get<APIResponse>(`${this.HOST_API}/category?status=1`);
  }
  
  createCategory(categoryName: string) {
    return this._http.post<APIResponse>(`${this.HOST_API}/category`, { categoryName })
  }

  getItems() {
    return this._http.get<APIResponse>(`${this.HOST_API}/item?status=1`);
  }
  
  createItem(item: any) {
    return this._http.post<APIResponse>(`${this.HOST_API}/item`, item);
  }
}
