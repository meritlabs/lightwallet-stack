import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VaultView } from './vault';
import { CommonPipesModule } from '@merit/common/common-pipes.module';
import { ComponentsModule } from '@merit/mobile/components/components.module';

@NgModule({
  declarations: [
    VaultView,
  ],
  imports: [
    IonicPageModule.forChild(VaultView),
    CommonPipesModule,
    ComponentsModule
  ]
})
export class VaultModule {}
