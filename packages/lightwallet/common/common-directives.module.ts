import { NgModule } from '@angular/core';
import { GtagDirective } from '@merit/common/directives/gtag.directive';

@NgModule({
  declarations: [GtagDirective],
  exports: [GtagDirective],
})
export class CommonDirectivesModule {}
