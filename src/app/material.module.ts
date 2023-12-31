import { NgModule } from '@angular/core';

import { MatBadgeModule } from '@angular/material/badge';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatStepperModule } from '@angular/material/stepper';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatTreeModule } from '@angular/material/tree';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatRadioModule } from '@angular/material/radio';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatPaginatorModule } from '@angular/material/paginator'
import { GetRemainderPipe } from './pipes/get-remainder.pipe';
import { MatCheckboxModule } from '@angular/material/checkbox';

const MATERIAL = [
  MatDialogModule,
  MatTabsModule,
  MatButtonModule,
  MatInputModule,
  MatIconModule,
  MatStepperModule,
  MatCardModule,
  MatSelectModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatTooltipModule,
  MatToolbarModule,
  MatMenuModule,
  MatBadgeModule,
  MatSidenavModule,
  MatListModule,
  MatTreeModule,
  MatSnackBarModule,
  MatProgressSpinnerModule,
  MatExpansionModule,
  MatAutocompleteModule,
  MatRadioModule,
  MatSlideToggleModule,
  MatProgressBarModule,
  MatPaginatorModule,
  MatCheckboxModule

];

@NgModule({
  declarations: [GetRemainderPipe],
  imports: MATERIAL,
  exports: [...MATERIAL, GetRemainderPipe],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' } // to make the date dd/MM/yyyy
  ]
})
export class MaterialModule { }
