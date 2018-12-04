import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VaultCreateConfirmView } from './vault-create-confirm';
import { CommonPipesModule } from '@merit/common/common-pipes.module';
import { ClipModule } from 'ng2-clip';

@NgModule({
  declarations: [VaultCreateConfirmView],
  imports: [IonicPageModule.forChild(VaultCreateConfirmView), CommonPipesModule, ClipModule],
})
export class VaultCreateConfirmModule {}
