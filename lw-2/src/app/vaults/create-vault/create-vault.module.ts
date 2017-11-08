import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { CreateVaultGeneralInfoView } from 'merit/vaults/create-vault/general-info/general-info';

import { ConfigService } from "merit/shared/config.service";
import { CreateVaultService } from 'merit/vaults/create-vault/create-vault.service';

@NgModule({
  declarations: [
    CreateVaultGeneralInfoView,
  ],
  providers: [
    ConfigService,
    CreateVaultService,
  ],
  imports: [
    IonicPageModule.forChild(CreateVaultGeneralInfoView),
  ],
})
export class CreateVaultComponentModule {}