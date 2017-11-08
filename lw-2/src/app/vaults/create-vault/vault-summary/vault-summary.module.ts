import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { CreateVaultSummaryView } from 'merit/vaults/create-vault/vault-summary/vault-summary';

import { ConfigService } from "merit/shared/config.service";

@NgModule({
  declarations: [
    CreateVaultSummaryView,
  ],
  providers: [
    ConfigService,
  ],
  imports: [
    IonicPageModule.forChild(CreateVaultSummaryView),
  ],
})
export class CreateVaultSummaryComponentModule {}