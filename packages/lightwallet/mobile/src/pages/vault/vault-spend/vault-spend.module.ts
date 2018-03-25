import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VaultSpendView } from './vault-spend';
import { ComponentsModule } from '@merit/mobile/components/components.module';
import { CommonPipesModule } from '@merit/common/common-pipes.module';

@NgModule({
  declarations: [
    VaultSpendView,
  ],
  imports: [
    IonicPageModule.forChild(VaultSpendView),
    CommonPipesModule, 
    ComponentsModule
  ],
})
export class VaultSpendModule {}
