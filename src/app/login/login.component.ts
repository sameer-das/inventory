import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, finalize, takeUntil } from 'rxjs';
import { PopupService } from '../popups/popup.service';
import { AuthService } from '../services/auth.service';
import { LoaderService } from '../services/loader.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  constructor(private _router: Router, private _loaderService: LoaderService,
    private _popupService: PopupService, private _authService: AuthService) {

  }
  ngOnInit(): void {
    // throw new Error('Method not implemented.');
  }
  ngOnDestroy(): void {
    this.destroy$.next(true)
  }

  private destroy$: Subject<boolean> = new Subject<boolean>();

  onSubmit(f: NgForm) {
    if (f.valid) {
      this._loaderService.showLoader()
      this._authService.authenticate(f.value)
        .pipe(takeUntil(this.destroy$), finalize(() => this._loaderService.hideLoader()))
        .subscribe({
          next: (resp: any) => {
            // console.log(resp)
            if (resp.status === 200 && resp.result) {
              localStorage.setItem('auth-token', resp.result);
              this._router.navigate(['sale']);
            } else {
              this._popupService.openAlert({
                header: 'Fail',
                message: 'Error while logging in. Please try after sometime.'
              })
            }
          }, error: (err) => {
            // console.log(err)
            if (err.error.status === 404) {
              this._popupService.openAlert({
                header: 'Error',
                message: 'Invalid Credentials.'
              })
            }
          }

        })
    }
  }
}
