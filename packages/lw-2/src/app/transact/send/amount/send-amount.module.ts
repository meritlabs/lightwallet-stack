import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SendAmountView } from 'merit/transact/send/amount/send-amount';

import { ProfileService } from 'merit/core/profile.service';
import { GravatarModule } from 'merit/shared/gravatar.module';
import { RateService } from 'merit/transact/rate.service';


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
  ],
  providers: [
    RateService
  ]
})
export class SendAmountModule {}
