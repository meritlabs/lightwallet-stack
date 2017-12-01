import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SharedModule } from 'merit/shared/shared.module';

import { VaultSpendConfirmView } from './vault-spend-confirm';

import { ProfileService } from 'merit/core/profile.service';
import { WalletService } from 'merit/wallets/wallet.service';
import { WalletsModule } from "merit/wallets/wallets.module";
import { NotificationService } from 'merit/shared/notification.service';
import { FeeLevelModal } from 'merit/shared/fee/fee-level-modal';
import { FeeService } from 'merit/shared/fee/fee.service';
import { EasySendService } from 'merit/transact/send/easy-send/easy-send.service';
import { SocialSharing } from '@ionic-native/social-sharing';

/*
  ToDo: Work to get this lazy-loadable as possible. 
*/
@NgModule({
  declarations: [
    VaultSpendConfirmView,
  ],
  imports: [
    IonicPageModule.forChild(VaultSpendConfirmView),
    SharedModule,
  ],
  providers: [
    WalletService,
    NotificationService,
    EasySendService,
    SocialSharing,
    FeeService,
    FeeLevelModal,
  ]
})
export class VaultSpendConfirmModule {}