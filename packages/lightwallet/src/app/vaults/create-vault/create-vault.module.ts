import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CreateVaultView } from 'merit/vaults/create-vault/create-vault';
import { CreateVaultService } from "merit/vaults/create-vault/create-vault.service";

@NgModule({
  declarations: [
    CreateVaultView,
  ],
  imports: [
    IonicPageModule.forChild(CreateVaultView),
  ],
  providers: [
    CreateVaultService
  ]
})
export class CreateVaultComponentModule {
}
