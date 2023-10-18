import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Observable, Subject, debounceTime, distinctUntilChanged, filter, map, switchMap, takeUntil, tap } from 'rxjs';
import { SearchItemService } from '../search-item.service';
@Component({
  selector: 'app-search-item',
  templateUrl: './search-item.component.html',
  styleUrls: ['./search-item.component.scss']
})
export class SearchItemComponent implements OnInit, OnDestroy {

  control = new FormControl('');

  filteredOptions!: Observable<any[]>;
  val!: Observable<any[]>;
  isLoading: boolean = false;
  private destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private _searchItemService: SearchItemService) { }

  @Input('withStock') withStock!: boolean;
  @Output() onItemSelection: EventEmitter<any> = new EventEmitter<any>();

  ngOnInit() {
    this.filteredOptions = this.control.valueChanges.pipe(
      takeUntil(this.destroy$),
      filter(search => typeof search === 'string'),
      distinctUntilChanged(),
      debounceTime(300),
      map(x => x ? x : ''),
      switchMap(search => {
        if (!this.withStock)
          return this._searchItemService.searchItem(search)
        else
          return this._searchItemService.searchItemWithStock(search).pipe(
            filter(items => items.length > 0),
            map(curr => {
              return [{
                "item_name": curr[0].item_name,
                "category_name": curr[0].category_name,
                "brand_name": curr[0].brand_name,
                "uid": curr[0].uid,
                "item_id": curr[0].item_id,
                "category_id": curr[0].category_id,
                "brand_id": curr[0].brand_id,
                "stock": curr
              }]
            }))
      })
    );

    // to clear
    this._searchItemService.clearSearch.subscribe({
      next: () => this.clear()
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }

  onSelection(e: MatAutocompleteSelectedEvent) {
    console.log(this.control.value)
    this.onItemSelection.emit(this.control.value);


  }

  displayWith(option: any) {
    return option.item_name;
  }

  clear() {
    this.control.setValue('');
  }

}
