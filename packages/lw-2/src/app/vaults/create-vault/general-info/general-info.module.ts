import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { CreateVaultGeneralInfoView } from 'merit/vaults/create-vault/general-info/general-info';

import { MnemonicService } from "merit/utilities/mnemonic/mnemonic.service";
import { VaultsService } from 'merit/vaults/vaults.service';

@NgModule({
  declarations: [
    CreateVaultGeneralInfoView,
  ],
  providers: [
    MnemonicService,
    VaultsService,
  ],
  imports: [
    IonicPageModule.forChild(CreateVaultGeneralInfoView),
  ],
})
export class CreateVaultGeneralInfoComponentModule {}
