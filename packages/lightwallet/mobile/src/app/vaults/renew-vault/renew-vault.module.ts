import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VaultRenewView } from '@merit/mobile/app/vaults/renew-vault/renew-vault';

@NgModule({
  declarations: [
    VaultRenewView,
  ],
  imports: [
    IonicPageModule.forChild(VaultRenewView),
  ],
})
export class VaultRenewViewModule {
}
