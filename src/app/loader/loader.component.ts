import { Component } from '@angular/core';
import { LoaderService } from '../services/loader.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent {
  constructor(private _loaderService: LoaderService) { }

  disp: Observable<string> = this._loaderService.$dispObs;

  ngOnInit(): void {
  }
}
