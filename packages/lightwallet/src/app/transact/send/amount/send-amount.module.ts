import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SendAmountView } from 'merit/transact/send/amount/send-amount';

import { ProfileService } from 'merit/core/profile.service';
import { GravatarModule } from 'merit/shared/gravatar.module';
import { RateService } from 'merit/transact/rate.service';
import { EasySendService } from 'merit/transact/send/easy-send/easy-send.service';
import { SocialSharing } from '@ionic-native/social-sharing';


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
    RateService,
    EasySendService,
    SocialSharing
  ]
})
export class SendAmountModule {}
