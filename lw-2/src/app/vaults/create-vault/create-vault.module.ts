import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { CreateVaultGeneralInfoView } from 'merit/vaults/create-vault/general-info/general-info';

import { ConfigService } from "merit/shared/config.service";

@NgModule({
  declarations: [
    CreateVaultGeneralInfoView,
  ],
  providers: [
    ConfigService,
  ],
  imports: [
    IonicPageModule.forChild(CreateVaultGeneralInfoView),
  ],
})
export class CreateVaultComponentModule {}