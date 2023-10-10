import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { APIResponse } from '../apiresponse';
@Injectable()
export class SearchItemService {

  constructor(private _http: HttpClient) { }

  private API_BASE_URL: string = environment.API_BASE_URL;

  searchItem(search: string) {
    return this._http.get<any[]>(`${this.API_BASE_URL}/item/item-search?search=${search}`);
  }
}
