import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UnlockRoutingModule } from './unlock-routing.module';
import { UnlockComponent } from './unlock/unlock.component';

@NgModule({
  imports: [
    CommonModule,
    UnlockRoutingModule
  ],
  declarations: [UnlockComponent]
})
export class UnlockModule { }
