import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Observable, debounceTime, distinctUntilChanged, filter, map, switchMap, tap } from 'rxjs';
import { SearchItemService } from '../search-item.service';
@Component({
  selector: 'app-search-item',
  templateUrl: './search-item.component.html',
  styleUrls: ['./search-item.component.scss']
})
export class SearchItemComponent {
  searchedItems: any[] = ['Sameer', 'Atin', 'Jyoti', 'Ankita'];
  control = new FormControl('');

  filteredOptions!: Observable<any[]>;
  val!: Observable<any[]>;
  isLoading: boolean = false;
  constructor(private _searchItemService: SearchItemService) { }

  @Output() onItemSelection: EventEmitter<any> = new EventEmitter<any>();
  ngOnInit() {
    this.filteredOptions = this.control.valueChanges.pipe(
      filter(search => typeof search === 'string'),
      distinctUntilChanged(),
      debounceTime(300),
      map(x => x ? x : ''),
      switchMap(search => this._searchItemService.searchItem(search).pipe(
        tap((x) => console.log(x)),
      ))
    );
  }

  onSelection(e: MatAutocompleteSelectedEvent) {
    console.log(this.control.value)
    this.onItemSelection.emit(this.control.value);


  }

  displayWith(option: any) {
    return option.item_name;
  }

}
