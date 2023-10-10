import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchItemComponent } from './search-item/search-item.component';
import { MaterialModule } from '../material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { SearchItemService } from './search-item.service';
import { HttpClientModule } from '@angular/common/http';



@NgModule({
  declarations: [
    SearchItemComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [SearchItemService],
  exports: [SearchItemComponent]
})
export class SearchItemModule { }
