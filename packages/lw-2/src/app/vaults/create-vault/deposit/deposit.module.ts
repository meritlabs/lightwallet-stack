import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { CreateVaultDepositView } from 'merit/vaults/create-vault/deposit/deposit';

import { MnemonicService } from "merit/utilities/mnemonic/mnemonic.service";
import { BwcService } from "merit/core/bwc.service";

@NgModule({
  declarations: [
    CreateVaultDepositView,
  ],
  providers: [
    MnemonicService,
    BwcService,
  ],
  imports: [
    IonicPageModule.forChild(CreateVaultDepositView),
  ],
})
export class CreateVaultDepositComponentModule {}
