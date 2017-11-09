import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { CreateVaultGeneralInfoView } from 'merit/vaults/create-vault/general-info/general-info';

import { WalletService } from "merit/wallets/wallet.service";
import { ProfileService } from "merit/core/profile.service";
import { MnemonicService } from "merit/utilities/mnemonic/mnemonic.service";

@NgModule({
  declarations: [
    CreateVaultGeneralInfoView,
  ],
  providers: [
    ProfileService,
    WalletService,
    MnemonicService,
  ],
  imports: [
    IonicPageModule.forChild(CreateVaultGeneralInfoView),
  ],
})
export class CreateVaultComponentModule {}