import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { VaultRenewConfirmationView } from 'merit/vaults/renew-vault/confirmation/confirmation';
import { RenewVaultService } from 'merit/vaults/renew-vault/renew-vault.service';
import { VaultsService } from 'merit/vaults/vaults.service';


@NgModule({
  declarations: [
    VaultRenewConfirmationView,
  ],
  providers: [
    RenewVaultService,
    VaultsService,
  ],
  imports: [
    IonicPageModule.forChild(VaultRenewConfirmationView),
  ],
})
export class VaultRenewConfirmationViewModule {}
