import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UnlockView } from 'merit/onboard/unlock/unlock';
import { WalletService } from 'merit/wallets/wallet.service';

@NgModule({
  declarations: [
    UnlockView,
  ],
  providers: [
    WalletService
  ],
  imports: [
    IonicPageModule.forChild(UnlockView),
  ],
})
export class UnlockViewModule {}
