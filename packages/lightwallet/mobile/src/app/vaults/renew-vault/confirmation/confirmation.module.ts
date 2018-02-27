import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VaultRenewConfirmationView } from '@merit/mobile/app/vaults/renew-vault/confirmation/confirmation';

@NgModule({
  declarations: [
    VaultRenewConfirmationView,
  ],
  imports: [
    IonicPageModule.forChild(VaultRenewConfirmationView),
  ],
})
export class VaultRenewConfirmationViewModule {
}
