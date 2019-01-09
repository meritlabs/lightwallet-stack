import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DirectivesModule } from '@merit/mobile/directives/directives.module';
import { VaultDepositView } from './vault-deposit';
import { CommonPipesModule } from '@merit/common/common-pipes.module';
import { ComponentsModule } from '@merit/mobile/components/components.module';

@NgModule({
  declarations: [VaultDepositView],
  imports: [IonicPageModule.forChild(VaultDepositView), CommonPipesModule, ComponentsModule, DirectivesModule],
})
export class VaultDepositModule {}
