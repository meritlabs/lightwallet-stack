import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { CreateVaultView } from 'merit/vaults/create-vault/create-vault';

import { MnemonicService } from "merit/utilities/mnemonic/mnemonic.service";
import { CreateVaultGeneralInfoComponentModule } from "merit/vaults/create-vault/general-info/general-info.module";

@NgModule({
  declarations: [
    CreateVaultView,
  ],
  providers: [
    MnemonicService,
  ],
  imports: [
    CreateVaultGeneralInfoComponentModule,
    IonicPageModule.forChild(CreateVaultView),
  ],
})
export class CreateVaultComponentModule {}
