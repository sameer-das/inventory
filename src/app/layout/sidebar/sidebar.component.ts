import { Component, ElementRef, Directive, HostListener } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {

}


@Directive({
  selector: '[haveSubmenu]',
})
export class HaveSubmenuDirective {
  constructor(private _el: ElementRef) {}
  @HostListener('click') onClick() {
    if (this._el.nativeElement.nextSibling.classList.contains('active')) {
      this._el.nativeElement.classList.remove('active');
      this._el.nativeElement.nextSibling.classList.remove('active');
      setTimeout(() => {
        this._el.nativeElement.lastChild.innerText = 'arrow_right';
      },200)
    } else {
      this._el.nativeElement.nextSibling.classList.add('active');
      this._el.nativeElement.classList.add('active');
      setTimeout(() => {
        this._el.nativeElement.lastChild.innerText = 'arrow_drop_down';
      },200)
    }
  }
}
