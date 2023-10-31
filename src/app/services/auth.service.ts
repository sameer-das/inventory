import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { APIResponse } from '../apiresponse';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private _http: HttpClient) { }
  private API_BASE_URL: string = environment.API_BASE_URL;
  authenticate(auth: any) {
    return this._http.post<APIResponse>(`${this.API_BASE_URL}/authenticate`, auth);
  }
}
