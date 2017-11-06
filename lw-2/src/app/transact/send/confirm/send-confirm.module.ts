import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SendConfirmView } from 'merit/transact/send/confirm/send-confirm';
import { ProfileService } from 'merit/core/profile.service';


/*
  The final step of sending a transaction.  
*/
@NgModule({
  declarations: [
    SendConfirmView
  ],
  imports: [
    IonicPageModule.forChild(SendConfirmView)
  ],
  providers: [
  ]
})
export class SendConfirmModule {}
