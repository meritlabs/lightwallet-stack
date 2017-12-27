import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TxDetailsView } from 'merit/wallets/tx-details/tx-details';
import { SharedModule } from 'merit/shared/shared.module';
import { MomentModule } from 'angular2-moment/moment.module';
import { WalletService } from 'merit/wallets/wallet.service';
import { MnemonicService } from 'merit/utilities/mnemonic/mnemonic.service';

@NgModule({
  declarations: [
    TxDetailsView
  ],
  imports: [
    IonicPageModule.forChild(TxDetailsView),
    SharedModule,
    MomentModule
  ],
  providers: [
    WalletService,
    MnemonicService,
  ]
})
export class TxDetailsViewModule {}
