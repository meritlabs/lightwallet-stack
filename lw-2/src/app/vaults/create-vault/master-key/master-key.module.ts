import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { CreateVaultMasterKeyView } from 'merit/vaults/create-vault/master-key/master-key';

import { ConfigService } from "merit/shared/config.service";

@NgModule({
  declarations: [
    CreateVaultMasterKeyView,
  ],
  providers: [
    ConfigService,
  ],
  imports: [
    IonicPageModule.forChild(CreateVaultMasterKeyView),
  ],
})
export class CreateVaultMasterKeyComponentModule {}