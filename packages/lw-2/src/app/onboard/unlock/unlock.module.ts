import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UnlockView } from 'merit/onboard/unlock/unlock';
import { WalletService } from 'merit/wallets/wallet.service';
import { WalletsModule } from 'merit/wallets/wallets.module';

/* 
  This module represents the unlock wallet page, and is the f
*/ 
@NgModule({
  declarations: [
    UnlockView,
  ],
  providers: [
  ],
  imports: [
    IonicPageModule.forChild(UnlockView),
    WalletsModule
  ],
})
export class UnlockViewModule {}
