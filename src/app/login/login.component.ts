import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  constructor(private _router: Router) {

  }
  onSubmit(f: NgForm) {
    console.log(f.value)

    if(f.value.userid === 'admin' && f.value.password === 'admin') {
      this._router.navigate(['sale'])
    } else {
      alert('Invalid Credentials.');
      f.reset();
    }
  }
}
