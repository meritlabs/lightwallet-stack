import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ToFiatPipe } from 'merit/shared/to-fiat.pipe';
import { ToUnitPipe } from 'merit/shared/to-unit.pipe';

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
    TranslateModule
  ]
})
export class SharedModule {
}
