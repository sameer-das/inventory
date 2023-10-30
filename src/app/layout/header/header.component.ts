import { Component, EventEmitter, Output, Input, OnInit, OnDestroy } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subject, filter, takeUntil } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Output() toggleSideBar = new EventEmitter<boolean>();
  @Input() isMenuOpened: boolean = false;

  private destroy$: Subject<boolean> = new Subject<boolean>();
  constructor(private _router: Router) {

  }
  ngOnDestroy(): void {
    this.destroy$.next(true);
  }
  currentUrl!: string;
  currentMenuName!: string | null | undefined;
  urlMenuMapping: any = {
    '/purchase': 'Add Stock/New Purchase',
    '/sale': 'New Sale',
    '/stock': 'All Stock',
    '/sale/list-sales': 'Sale History',
    '/purchase/list-purchases': 'Purchase History',
  }

  ngOnInit(): void {
    this.currentUrl = this._router.url;
    this.currentMenuName = this.urlMenuMapping[this.currentUrl];
    this._router.events.pipe(takeUntil(this.destroy$), filter(x => x instanceof NavigationEnd)).subscribe({
      next: (resp: any) => {
        // console.log(resp)
        this.currentUrl = resp.url || this.currentUrl;
        this.currentMenuName = this.urlMenuMapping[this.currentUrl];
      }
    })

  }
  openMenu() {
    this.isMenuOpened = !this.isMenuOpened;
    this.toggleSideBar.emit(this.isMenuOpened);
  }

  logout() {

    const confirm = window.confirm('Are you sure to logout?');
    if (confirm) {
      this._router.navigate(['login'])
    }
  }
}
