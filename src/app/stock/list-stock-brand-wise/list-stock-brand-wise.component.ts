import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoaderService } from 'src/app/services/loader.service';
import { StockService } from '../stock.service';
import { Subject, takeUntil, finalize, startWith, filter, debounceTime, distinctUntilChanged, tap } from 'rxjs';
import { APIResponse } from 'src/app/apiresponse';
import { MatDialog } from '@angular/material/dialog';
import { ItemStockDetailsComponent } from 'src/app/popups/item-stock-details/item-stock-details.component';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-list-stock-brand-wise',
  templateUrl: './list-stock-brand-wise.component.html',
  styleUrls: ['./list-stock-brand-wise.component.scss']
})
export class ListStockBrandWiseComponent implements OnInit, OnDestroy {
  constructor(private _route: ActivatedRoute, private _router: Router,
    private _loaderService: LoaderService, private _stockService: StockService,
    private _dialog: MatDialog) {

  }

  private destroy$: Subject<boolean> = new Subject<boolean>();

  items: any[] = [];
  filteredItems: any[] = [];
  brandId: number = 0;
  total: number = 0;

  filterValue: FormControl = new FormControl('');

  ngOnInit(): void {
    this._route.params.subscribe((params: any) => {
      if (!params.brandId) {
        this._router.navigate(['stock']);
      } else {
        this.brandId = params.brandId;
        this.getAllItemsOfABrand(params.brandId);
      }
    });

    this.filterValue.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe((val: string) => {
      if(val.trim() === '') {
        this.filteredItems = [...this.items]
      } else {
        this.filteredItems = this.items.filter((curr: any) => {
          return curr.item_name.toLowerCase().includes(val.toLowerCase())
        })
      }

    })
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }


  getAllItemsOfABrand(brandId: number) {
    this._loaderService.showLoader();
    this._stockService.getAllItemsOfABrand(brandId)
      .pipe(takeUntil(this.destroy$), finalize(() => this._loaderService.hideLoader()))
      .subscribe({
        next: (resp: APIResponse) => {
          console.log(resp)
          if (resp.status === 200) {
            this.items = resp.result;
            this.filteredItems = [...resp.result];
          }
        },
        error: (err) => {
          console.log('Error while fetching all items')
          console.log(err)
        }
      })
  }

  onItemClick(item_id: number) {
    this._dialog.open(ItemStockDetailsComponent, {
      minWidth: '70vw',
      height: '60vh',
      panelClass: 'item-stock-details',
      data: item_id
    })
  }

  onClearFilter() {
    this.filterValue.setValue('');
  }

}
