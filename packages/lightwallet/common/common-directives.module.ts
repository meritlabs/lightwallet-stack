import { NgModule } from '@angular/core';
import { GtagDirective } from '@merit/common/directives/gtag.directive';
import { ScrollTopDirective } from '@merit/common/directives/scroll-top.directive';
import { BlurOnClickDirective } from '@merit/common/directives/blur-on-click.directive';

@NgModule({
  declarations: [
    GtagDirective,
    ScrollTopDirective,
    BlurOnClickDirective,
  ],
  exports: [
    GtagDirective,
    ScrollTopDirective,
    BlurOnClickDirective,
  ],
})
export class CommonDirectivesModule {
}
