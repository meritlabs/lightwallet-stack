import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GravatarModule } from 'merit/shared/gravatar.module';
import { SendAmountView } from 'merit/transact/send/amount/send-amount';


/*
  Transact is the most thoughtful name we can think of to define all of
  'primary' actions associated with merit (receiving, sending, primarily).
*/
@NgModule({
  declarations: [
    SendAmountView
  ],
  imports: [
    GravatarModule,
    IonicPageModule.forChild(SendAmountView)
  ]
})
export class SendAmountModule {
}
