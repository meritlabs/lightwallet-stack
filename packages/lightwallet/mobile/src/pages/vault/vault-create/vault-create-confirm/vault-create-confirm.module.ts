import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VaultCreateConfirmView } from './vault-create-confirm';
import { CommonPipesModule } from '@merit/common/common-pipes.module';

@NgModule({
  declarations: [
    VaultCreateConfirmView,
  ],
  imports: [
    IonicPageModule.forChild(VaultCreateConfirmView),
    CommonPipesModule
  ],
})
export class VaultCreateConfirmModule {}
