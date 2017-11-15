import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { CreateVaultGeneralInfoView } from 'merit/vaults/create-vault/general-info/general-info';

import { BwcService } from 'merit/core/bwc.service';
import { MnemonicService } from "merit/utilities/mnemonic/mnemonic.service";
import { WalletService } from "merit/wallets/wallet.service";

@NgModule({
  declarations: [
    CreateVaultGeneralInfoView,
  ],
  providers: [
    MnemonicService,
    WalletService,
    BwcService,
  ],
  imports: [
    IonicPageModule.forChild(CreateVaultGeneralInfoView),
  ],
})
export class CreateVaultComponentModule {}
