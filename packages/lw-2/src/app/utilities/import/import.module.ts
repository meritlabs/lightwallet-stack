import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ImportView } from 'merit/utilities/import/import';
import { DerivationPathService } from "merit/utilities/mnemonic/derivation-path.service";
import { WalletService } from "merit/wallets/wallet.service";
import { MnemonicService } from "merit/utilities/mnemonic/mnemonic.service";

@NgModule({
  declarations: [
    ImportView
  ],
  imports: [
    IonicPageModule.forChild(ImportView),
  ],
  providers: [
    DerivationPathService,
    WalletService,
    MnemonicService
  ]
})
export class ImportComponentModule {}
