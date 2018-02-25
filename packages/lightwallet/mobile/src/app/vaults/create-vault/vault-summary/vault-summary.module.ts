import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CreateVaultSummaryView } from '@merit/mobile/app/vaults/create-vault/vault-summary/vault-summary';

@NgModule({
  declarations: [
    CreateVaultSummaryView,
  ],
  imports: [
    IonicPageModule.forChild(CreateVaultSummaryView),
  ],
})
export class CreateVaultSummaryComponentModule {
}
