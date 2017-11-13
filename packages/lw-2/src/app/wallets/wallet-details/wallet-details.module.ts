import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WalletDetailsView } from 'merit/wallets/wallet-details/wallet-details';
import { TouchIdModule } from 'merit/shared/touch-id/touch-id.module';
import { TouchIdService } from 'merit/shared/touch-id/touch-id.service';
import { PopupService } from 'merit/core/popup.service';
import { MnemonicService } from 'merit/utilities/mnemonic/mnemonic.service';

/*
  ToDo: Work to get this lazy-loadable as possible. 
*/
@NgModule({
  declarations: [
    WalletDetailsView
  ],
  imports: [
    IonicPageModule.forChild(WalletDetailsView)
  ],
  providers: [
    MnemonicService
  ]
})
export class WalletDetailsModule {}
