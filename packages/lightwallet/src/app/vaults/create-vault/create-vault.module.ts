import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CreateVaultView } from 'merit/vaults/create-vault/create-vault';

@NgModule({
  declarations: [
    CreateVaultView,
  ],
  imports: [
    IonicPageModule.forChild(CreateVaultView),
  ],
})
export class CreateVaultComponentModule {
}
