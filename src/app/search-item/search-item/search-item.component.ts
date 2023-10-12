import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
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
  searchedItems: any[] = ['Sameer', 'Atin', 'Jyoti', 'Ankita'];
  control = new FormControl('');

  filteredOptions!: Observable<any[]>;
  val!: Observable<any[]>;
  isLoading: boolean = false;
  private destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private _searchItemService: SearchItemService) { }


  @Output() onItemSelection: EventEmitter<any> = new EventEmitter<any>();

  ngOnInit() {
    this.filteredOptions = this.control.valueChanges.pipe(
      takeUntil(this.destroy$),
      filter(search => typeof search === 'string'),
      distinctUntilChanged(),
      debounceTime(300),
      map(x => x ? x : ''),
      switchMap(search => this._searchItemService.searchItem(search).pipe(
        tap((x) => console.log(x)),
      ))
    );
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

}
