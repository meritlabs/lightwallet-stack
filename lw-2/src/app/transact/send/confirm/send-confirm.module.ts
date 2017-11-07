import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SendConfirmView } from 'merit/transact/send/confirm/send-confirm';
import { GravatarModule } from 'merit/shared/gravatar.module';
import { ProfileService } from 'merit/core/profile.service';
import { WalletService } from 'merit/wallets/wallet.service';
import { WalletsModule } from "merit/wallets/wallets.module";
import { NotificationService } from 'merit/shared/notification.service';




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
    NotificationService
  ]
})
export class SendConfirmModule {}
