import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SendConfirmView } from 'merit/transact/send/confirm/send-confirm';
import { GravatarModule } from 'merit/shared/gravatar.module';
import { ProfileService } from 'merit/core/profile.service';
import { WalletService } from 'merit/wallets/wallet.service';
import { WalletsModule } from "merit/wallets/wallets.module";
import { NotificationService } from 'merit/shared/notification.service';
import { FeeService } from 'merit/shared/fee/fee.service';
import { EasySendService } from 'merit/transact/send/easy-send/easy-send.service';
import { SocialSharing } from '@ionic-native/social-sharing';

/*
  The final step of sending a transaction.
*/
@NgModule({
  declarations: [
    SendConfirmView
  ],
  imports: [
    IonicPageModule.forChild(SendConfirmView),
    GravatarModule,
    WalletsModule
  ],
  providers: [
    WalletService,
    NotificationService,
    EasySendService,
    SocialSharing,
    FeeService
  ]
})
export class SendConfirmModule {}
