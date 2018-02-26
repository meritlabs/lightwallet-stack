import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CreateVaultConfirmView } from './create-vault-confirm';

@NgModule({
  declarations: [
    CreateVaultConfirmView,
  ],
  imports: [
    IonicPageModule.forChild(CreateVaultConfirmView),
  ],
})
export class CreateVaultConfirmModule {}
