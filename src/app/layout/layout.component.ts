import { Component, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent {

  @ViewChild('sidenav') sidenav!: MatSidenav;
  toggleSidebar(e: boolean) {
    e ? this.sidenav.open() : this.sidenav.close()
  }

  isopened: boolean = false;
  onChange(e:boolean) {
    this.isopened = e;
  }
}
