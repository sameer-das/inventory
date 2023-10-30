import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerComponent } from './customer/customer.component';
import { BillerComponent } from './biller/biller.component';
import { RelationsRoutingModule } from './relations-routing.module';
import { MaterialModule } from '../material.module';
import { AddRelationsComponent } from '../popups/add-relations/add-relations.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RealtionsService } from './realtions.service';
import { HttpClientModule } from '@angular/common/http';



@NgModule({
  declarations: [
    CustomerComponent,
    BillerComponent,
    AddRelationsComponent
  ],
  imports: [
    CommonModule,
    RelationsRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [RealtionsService]
})
export class RelationsModule { }
