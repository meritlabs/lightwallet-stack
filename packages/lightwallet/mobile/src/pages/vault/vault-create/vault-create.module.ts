import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VaultCreateView } from './vault-create';
import { CommonPipesModule } from '@merit/common/common-pipes.module';

@NgModule({
  declarations: [
    VaultCreateView,
  ],
  imports: [
    IonicPageModule.forChild(VaultCreateView),
    CommonPipesModule
  ]
})
export class VaultCreateModule {}
