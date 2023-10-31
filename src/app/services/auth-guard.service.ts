import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {

  constructor() { }

  isLoggedIn(token: string): boolean {
    if (!token) {
      return false;
    }
    // console.log(token);
    const _payload = token.split('.')[1];
    const payload = atob(_payload);

    // console.log(payload)
    return this.tokenValid(payload);
  }

  private tokenValid(payload: string) {
    const expiry = (JSON.parse(payload)).exp;
    return (Math.floor((new Date).getTime() / 1000)) < expiry;
  }

}



