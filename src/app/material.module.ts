import { NgModule } from '@angular/core';

import {
  MatButtonModule,
  MatToolbarModule,
  MatIconModule,
  MatCardModule,
  MatTooltipModule,
  MatSlideToggleModule,
  MatSidenavModule,
  MatSnackBarModule,
  MatListModule,
  MatProgressBarModule,
  MAT_SNACK_BAR_DEFAULT_OPTIONS,
  MatChipsModule,
  MatFormFieldModule,
  MatInputModule,
  MatDialogModule,
  MatMenuModule,
  MatSelectModule,
  MatSliderModule,
} from '@angular/material';

@NgModule({
  providers: [
    {provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: {duration: 1.5e3}}
  ],
  exports: [
    MatToolbarModule,
    MatIconModule,
    MatTooltipModule,
    MatSlideToggleModule,
    MatSidenavModule,
    MatButtonModule,
    MatSnackBarModule,
    MatListModule,
    MatCardModule,
    MatProgressBarModule,
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatMenuModule,
    MatSelectModule,
    MatSliderModule
  ]
})
export class MaterialModule { }
