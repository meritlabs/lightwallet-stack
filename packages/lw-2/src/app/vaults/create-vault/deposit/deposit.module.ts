import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { CreateVaultDepositView } from 'merit/vaults/create-vault/deposit/deposit';

import { ConfigService } from "merit/shared/config.service";

@NgModule({
  declarations: [
    CreateVaultDepositView,
  ],
  providers: [
    ConfigService,
  ],
  imports: [
    IonicPageModule.forChild(CreateVaultDepositView),
  ],
})
export class CreateVaultDepositComponentModule {}