import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { CreateVaultDepositView } from 'merit/vaults/create-vault/deposit/deposit';

import { WalletService } from "merit/wallets/wallet.service";
import { MnemonicService } from "merit/utilities/mnemonic/mnemonic.service";

@NgModule({
  declarations: [
    CreateVaultDepositView,
  ],
  providers: [
    WalletService,
    MnemonicService,
  ],
  imports: [
    IonicPageModule.forChild(CreateVaultDepositView),
  ],
})
export class CreateVaultDepositComponentModule {}