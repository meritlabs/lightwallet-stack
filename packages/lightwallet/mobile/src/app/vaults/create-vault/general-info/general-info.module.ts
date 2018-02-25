import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CreateVaultGeneralInfoView } from '@merit/mobile/app/vaults/create-vault/general-info/general-info';

@NgModule({
  declarations: [
    CreateVaultGeneralInfoView,
  ],
  imports: [
    IonicPageModule.forChild(CreateVaultGeneralInfoView),
  ],
})
export class CreateVaultGeneralInfoComponentModule {
}
