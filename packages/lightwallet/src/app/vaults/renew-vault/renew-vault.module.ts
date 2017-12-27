import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { VaultRenewView } from 'merit/vaults/renew-vault/renew-vault';

import { PopupService } from "merit/core/popup.service";
import { RenewVaultService } from 'merit/vaults/renew-vault/renew-vault.service';

@NgModule({
  declarations: [
    VaultRenewView,
  ],
  providers: [
    PopupService,
    RenewVaultService,
  ],
  imports: [
    IonicPageModule.forChild(VaultRenewView),
  ],
})
export class VaultRenewViewModule {}
