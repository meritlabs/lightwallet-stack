import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GravatarModule } from 'merit/shared/gravatar.module';
import { SendView } from 'merit/transact/send/send';

// This module manaages the sending of money.
// This is the first of three steps.
@NgModule({
  declarations: [
    SendView
  ],
  imports: [
    IonicPageModule.forChild(SendView),
    GravatarModule
  ]
})
export class SendViewModule {
}
