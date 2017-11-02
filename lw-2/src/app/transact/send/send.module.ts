import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SendView } from 'merit/transact/send/send';
import { GravatarComponent } from 'merit/shared/gravatar.component';

// This module manaages the sending of money.
@NgModule({
  declarations: [
    SendView,
  ],
  imports: [
    IonicPageModule.forChild(SendView),
    GravatarComponent
  ],
  exports: [
  ]
})
export class SendViewModule {}
