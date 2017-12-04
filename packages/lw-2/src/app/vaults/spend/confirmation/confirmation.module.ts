import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { VaultSpendConfirmationView } from 'merit/vaults/spend/confirmation/confirmation';

import { SpendVaultService } from 'merit/vaults/spend/vault-spend.service';


@NgModule({
  declarations: [
    VaultSpendConfirmationView,
  ],
  providers: [
    SpendVaultService,
  ],
  imports: [
    IonicPageModule.forChild(VaultSpendConfirmationView),
  ],
})
export class VaultSpendConfirmationViewModule {}
