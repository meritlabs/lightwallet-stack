import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CreateVaultMasterKeyView } from 'merit/vaults/create-vault/master-key/master-key';

@NgModule({
  declarations: [
    CreateVaultMasterKeyView,
  ],
  imports: [
    IonicPageModule.forChild(CreateVaultMasterKeyView),
  ],
})
export class CreateVaultMasterKeyComponentModule {
}
