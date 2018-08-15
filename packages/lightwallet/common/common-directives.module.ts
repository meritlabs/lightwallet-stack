import { NgModule } from '@angular/core';
import { GtagDirective } from '@merit/common/directives/gtag.directive';
import { ScrollTopDirective } from '@merit/common/directives/scroll-top.directive';

@NgModule({
  declarations: [
    GtagDirective,
    ScrollTopDirective
  ],
  exports: [
    GtagDirective,
    ScrollTopDirective
  ]
})
export class CommonDirectivesModule {}
