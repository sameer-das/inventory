import { HttpErrorResponse, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, catchError, throwError } from 'rxjs';
import { PopupService } from '../popups/popup.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root'
})
export class HttpInterceptorService implements HttpInterceptor {

  constructor(private _popupService: PopupService, private _router: Router, private _matdialog: MatDialog) { }
  intercept(req: HttpRequest<any>, next: HttpHandler,) {
    // Get the auth token from the service.

    const authToken = localStorage.getItem('auth-token') || '';
    console.log('inside http interceptor')
    // Clone the request and replace the original headers with
    // cloned headers, updated with the authorization.
    const authReq = req.clone({
      headers: req.headers.set('Authorization', 'Bearer ' + authToken)
    });

    // send cloned request with header to the next handler.
    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        // console.log('inside http interceptor catherror')
        // console.log(error)
        if (error.status === 401) {
          // if unauthorized
          this._matdialog.closeAll();
          this._popupService.openAlert({
            header: 'Alert',
            message: 'Your login session has expired. Please login again!'
          });
          this._router.navigate(['login'])

        }
        // rethrow the error
        return throwError(() => error);
      }),
      map((event) => {
        if (event instanceof HttpResponse) {
          //   console.log('Http Response');
        }
        return event;
      })
    );
  }
}
