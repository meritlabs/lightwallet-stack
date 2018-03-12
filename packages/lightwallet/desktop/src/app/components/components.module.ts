import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';
import { ErrorMessageComponent } from './error-message/error-message.component';
import { MeritIconComponent } from './merit-icon/merit-icon.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [LoadingSpinnerComponent, ErrorMessageComponent, MeritIconComponent],
  exports: [LoadingSpinnerComponent, ErrorMessageComponent, MeritIconComponent]
})
export class ComponentsModule { }
