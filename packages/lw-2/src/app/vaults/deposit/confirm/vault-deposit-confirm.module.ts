import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VaultDepositConfirmView } from 'merit/vaults/deposit/confirm/vault-deposit-confirm';
import { ToUnitPipe } from 'merit/shared/to-unit.pipe';
import { ToFiatPipe } from 'merit/shared/to-fiat.pipe';
import { SharedModule } from 'merit/shared/shared.module';
import { VaultsService } from 'merit/vaults/vaults.service';
import { MomentModule } from 'angular2-moment';

import { ProfileService } from 'merit/core/profile.service';
import { WalletService } from 'merit/wallets/wallet.service';
import { WalletsModule } from "merit/wallets/wallets.module";
import { NotificationService } from 'merit/shared/notification.service';
import { FeeLevelModal } from 'merit/shared/fee/fee-level-modal';
import { FeeService } from 'merit/shared/fee/fee.service';
import { EasySendService } from 'merit/transact/send/easy-send/easy-send.service';
import { SocialSharing } from '@ionic-native/social-sharing';
import { DepositService } from 'merit/vaults/deposit/deposit.service';

/*
  ToDo: Work to get this lazy-loadable as possible. 
*/
@NgModule({
  declarations: [
    VaultDepositConfirmView
  ],
  imports: [
    IonicPageModule.forChild(VaultDepositConfirmView),
    SharedModule,
  ],
  providers: [
    WalletService,
    NotificationService,
    EasySendService,
    SocialSharing,
    FeeService,
    FeeLevelModal,
    DepositService,
  ]
})
export class VaultDepositConfirmModule {}
