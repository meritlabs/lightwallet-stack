import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { CreateVaultSummaryView } from 'merit/vaults/create-vault/vault-summary/vault-summary';

import { ConfigService } from "merit/shared/config.service";
import { ProfileService } from 'merit/core/profile.service';
import { BwcService } from 'merit/core/bwc.service';

@NgModule({
  declarations: [
    CreateVaultSummaryView,
  ],
  providers: [
    ConfigService,
    BwcService,
    ProfileService,
  ],
  imports: [
    IonicPageModule.forChild(CreateVaultSummaryView),
  ],
})
export class CreateVaultSummaryComponentModule {}
