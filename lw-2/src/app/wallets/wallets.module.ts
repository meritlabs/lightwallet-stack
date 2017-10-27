import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WalletsView } from 'merit/wallets/wallets';
import { MomentModule } from 'angular2-moment';
import { BwcService } from 'merit/core/bwc.service';
import { TxFormatService } from 'merit/transact/tx-format.service';
import { WalletService } from 'merit/wallets/wallet.service';
import { MnemonicService } from 'merit/utilities/mnemonic/mnemonic.service';
import { LanguageService } from 'merit/core/language.service';


@NgModule({
  declarations: [
    WalletsView,
  ],
  providers: [
    WalletService,
    MnemonicService,
    LanguageService
  ]
  ,
  imports: [
    MomentModule,
    IonicPageModule.forChild(WalletsView),
  ],
})
export class WalletsModule {}
