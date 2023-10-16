import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
@Injectable()
export class SearchItemService {

  constructor(private _http: HttpClient) { }

  private API_BASE_URL: string = environment.API_BASE_URL;

  private clearItemSearch$: Subject<string> = new Subject();

  get clearSearch() {
    return this.clearItemSearch$.asObservable();
  }

  searchItem(search: string) {
    return this._http.get<any[]>(`${this.API_BASE_URL}/item/item-search?search=${search}`);
  }

  clearItemSearch(val?: string) {
    this.clearItemSearch$.next(val || '');
  }
}
