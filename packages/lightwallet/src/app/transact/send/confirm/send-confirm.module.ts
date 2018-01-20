import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GravatarModule } from 'merit/shared/gravatar.module';
import { SendConfirmView } from 'merit/transact/send/confirm/send-confirm';

/*
  The final step of sending a transaction.
*/
@NgModule({
  declarations: [
    SendConfirmView
  ],
  imports: [
    IonicPageModule.forChild(SendConfirmView),
    GravatarModule
  ]
})
export class SendConfirmModule {
}
