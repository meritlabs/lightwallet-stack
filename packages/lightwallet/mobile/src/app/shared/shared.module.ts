import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ToFiatPipe } from '@merit/mobile/app/shared/to-fiat.pipe';
import { ToUnitPipe } from '@merit/mobile/app/shared/to-unit.pipe';
import { MomentModule } from 'angular2-moment';

// This module manaages the sending of money.
@NgModule({
  declarations: [
    ToUnitPipe,
    ToFiatPipe
  ],
  imports: [],
  exports: [
    ToUnitPipe,
    ToFiatPipe,
    TranslateModule,
    MomentModule
  ]
})
export class SharedModule {
}
