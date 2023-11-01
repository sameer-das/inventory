import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddRelationsComponent } from 'src/app/popups/add-relations/add-relations.component';
import { RealtionsService } from '../realtions.service';
import { LoaderService } from 'src/app/services/loader.service';
import { PopupService } from 'src/app/popups/popup.service';
import { Subject, takeUntil, finalize } from 'rxjs';
import { APIResponse } from 'src/app/apiresponse';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss']
})
export class CustomerComponent implements OnInit, OnDestroy {

  constructor(private _dialog: MatDialog,
    private _relationsService: RealtionsService,
    private _loaderService: LoaderService,
    private _popupService: PopupService) {

  }
  ngOnInit(): void {
    this.getCustomers()
  }
  ngOnDestroy(): void {
    this.destroy$.next(true)
  }

  private destroy$: Subject<boolean> = new Subject<boolean>();

  customers: any[] = []
  onAdd() {
    this._dialog.open(AddRelationsComponent, {
      width: '400px',
      height: '350px',
      disableClose: true,
      data: { name: 'Customer' }
    });
  }

  getCustomers() {
    this._relationsService.getCustomer()
      .pipe(takeUntil(this.destroy$), finalize(() => this._loaderService.hideLoader()))
      .subscribe({
        next: (resp: APIResponse) => {
          if (resp.status === 200) {
            this.customers = resp.result;
          } else {
            this.customers = [];
          }
        }, error: (err) => {
          console.log(err);
        }
      })
  }
}
