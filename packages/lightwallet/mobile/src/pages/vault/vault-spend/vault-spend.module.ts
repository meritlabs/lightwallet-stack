import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DirectivesModule } from '@merit/mobile/directives/directives.module';
import { VaultSpendView } from './vault-spend';
import { ComponentsModule } from '@merit/mobile/components/components.module';
import { CommonPipesModule } from '@merit/common/common-pipes.module';

@NgModule({
  declarations: [VaultSpendView],
  imports: [IonicPageModule.forChild(VaultSpendView), CommonPipesModule, ComponentsModule, DirectivesModule],
})
export class VaultSpendModule {}
