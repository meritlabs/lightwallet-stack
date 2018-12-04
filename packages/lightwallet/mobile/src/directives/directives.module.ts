import { NgModule } from '@angular/core';
import { CustomHeaderColorDirective } from './custom-header-color/custom-header-color';
import { EnterToNextDirective } from './enter-to-next/enter-to-next';
@NgModule({
  declarations: [CustomHeaderColorDirective, EnterToNextDirective],
  imports: [],
  exports: [CustomHeaderColorDirective, EnterToNextDirective],
})
export class DirectivesModule {}
