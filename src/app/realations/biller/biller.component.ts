import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddRelationsComponent } from 'src/app/popups/add-relations/add-relations.component';
import { Subject, takeUntil, finalize } from 'rxjs';
import { RealtionsService } from '../realtions.service';
import { APIResponse } from 'src/app/apiresponse';
import { LoaderService } from 'src/app/loader.service';
import { PopupService } from 'src/app/popups/popup.service';
@Component({
  selector: 'app-biller',
  templateUrl: './biller.component.html',
  styleUrls: ['./biller.component.scss']
})
export class BillerComponent implements OnInit, OnDestroy {
  constructor(private _dialog: MatDialog,
    private _relationsService: RealtionsService,
    private _loaderService: LoaderService,
    private _popupService: PopupService) {

  }

  private destroy$: Subject<boolean> = new Subject<boolean>();

  billers: any[] = []
  ngOnInit(): void {
    this.getBillers()
  }
  ngOnDestroy(): void {
    this.destroy$.next(true)
  }
  onAdd() {
    this._dialog.open(AddRelationsComponent, {
      width: '400px',
      height: '50vh',
      disableClose: true,
      data: { name: 'Biller' }
    });
  }

  getBillers() {
    this._relationsService.getBiller()
      .pipe(takeUntil(this.destroy$), finalize(() => this._loaderService.hideLoader()))
      .subscribe({
        next: (resp: APIResponse) => {
          if (resp.status === 200) {
            this.billers = resp.result;
          } else {
            this.billers = [];
          }
        }, error: (err) => {
          console.log(err);
        }
      })
  }
}
