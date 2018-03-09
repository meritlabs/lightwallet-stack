import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';
import { ErrorMessageComponent } from './error-message/error-message.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [LoadingSpinnerComponent, ErrorMessageComponent],
  exports: [LoadingSpinnerComponent, ErrorMessageComponent]
})
export class ComponentsModule { }
