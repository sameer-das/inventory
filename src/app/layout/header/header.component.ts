import { Component, EventEmitter, Output, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  @Output() toggleSideBar = new EventEmitter<boolean>();
  @Input() isMenuOpened: boolean = false;

  constructor(private _router:Router){

  }
  openMenu() {
    this.isMenuOpened = !this.isMenuOpened;
    this.toggleSideBar.emit(this.isMenuOpened);
  }

  logout() {

    const confirm = window.confirm('Are you sure to logout?');
    if(confirm) {
      this._router.navigate(['login'])
    }
  }
}
