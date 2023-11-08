import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { APIResponse } from '../apiresponse';
import { environment } from 'src/environments/environment';
@Injectable()
export class StockService {

  constructor(private _http: HttpClient) { }

  private API_BASE_URL: string = environment.API_BASE_URL;

  getBrands() {
    return this._http.get<APIResponse>(`${this.API_BASE_URL}/brands?status=1`);
  }

  createBrand(brandname: string) {
    return this._http.post<APIResponse>(`${this.API_BASE_URL}/brands`, { brandname })
  }



  getCategories() {
    return this._http.get<APIResponse>(`${this.API_BASE_URL}/category?status=1`);
  }
  
  createCategory(categoryName: string) {
    return this._http.post<APIResponse>(`${this.API_BASE_URL}/category`, { categoryName })
  }

  getItems() {
    return this._http.get<APIResponse>(`${this.API_BASE_URL}/item?status=1`);
  }
  
  createItem(item: any) {
    return this._http.post<APIResponse>(`${this.API_BASE_URL}/item`, item);
  }

  getItemStockDetails(itemId: any) {
    return this._http.get<APIResponse>(`${this.API_BASE_URL}/item/item-stock-details?itemId=${itemId}`);
  }

  getStockWorthBrandWise() {
    return this._http.get<APIResponse>(`${this.API_BASE_URL}/item/stocks/all-brand`);
  }

  getAllItemsOfABrand(brandId: any) {
    return this._http.get<APIResponse>(`${this.API_BASE_URL}/item/by-brand?brandId=${brandId}`);
  }
}
