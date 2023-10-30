import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subject, takeUntil, finalize } from 'rxjs';
import { APIResponse } from 'src/app/apiresponse';
import { LoaderService } from 'src/app/loader.service';
import { RealtionsService } from 'src/app/realations/realtions.service';
import { PopupService } from '../popup.service';

@Component({
  selector: 'app-add-relations',
  templateUrl: './add-relations.component.html',
  styleUrls: ['./add-relations.component.scss']
})
export class AddRelationsComponent implements OnInit, OnDestroy {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    private _dialogRef: MatDialogRef<AddRelationsComponent>,
    private _relationsService: RealtionsService,
    private _loaderService: LoaderService,
    private _popupService: PopupService) { }

  private destroy$: Subject<boolean> = new Subject<boolean>();

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }

  relationsFormGroup: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    phone: new FormControl(''),
    gstn: new FormControl('NA'),
  });

  ngOnInit(): void {
    // throw new Error('Method not implemented.');
  }


  onClose() {
    this._dialogRef.close();
  }

  onSubmit() {

    console.log(this.relationsFormGroup.value)
    let obs;
    if (this.data.name === 'Biller') {
      obs = this._relationsService.addBiller(this.relationsFormGroup.value)
    } else if (this.data.name === 'Customer') {
      obs = this._relationsService.addCustomer(this.relationsFormGroup.value)
    }

    this._loaderService.showLoader();
    obs?.pipe(takeUntil(this.destroy$), finalize(() => this._loaderService.hideLoader()))
      .subscribe({
        next: (resp: APIResponse) => {
          if (resp.status === 200) {
            this._popupService.openAlert({
              header: 'Success',
              message: `${this.data.name} added successfully.`
            });
            this._dialogRef.close();
          } else {
            this._popupService.openAlert({
              header: 'Fail',
              message: `Failed while adding ${this.data.name.toLowerCase()}.`
            })
          }
        }, error: (err) => {
          console.log(err);
          this._popupService.openAlert({
            header: 'Error',
            message: `Error while adding ${this.data.name.toLowerCase()}.`
          })
        }
      })
  }
}
