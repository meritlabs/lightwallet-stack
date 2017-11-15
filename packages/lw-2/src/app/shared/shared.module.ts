import { NgModule } from '@angular/core';
import { GravatarComponent } from 'merit/shared/gravatar.component';
import { ToUnitPipe } from 'merit/shared/to-unit.pipe';
import { ToFiatPipe } from 'merit/shared/to-fiat.pipe';

// This module manaages the sending of money.
@NgModule({
  declarations: [
    ToUnitPipe,
    ToFiatPipe
  ],
  imports: [
  ],
  exports: [
    ToUnitPipe,
    ToFiatPipe
  ]
})
export class SharedModule {}
