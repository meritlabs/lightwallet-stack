import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DirectivesModule } from '@merit/mobile/directives/directives.module';
import { VaultCreateView } from './vault-create';
import { CommonPipesModule } from '@merit/common/common-pipes.module';

@NgModule({
  declarations: [VaultCreateView],
  imports: [IonicPageModule.forChild(VaultCreateView), CommonPipesModule, DirectivesModule],
})
export class VaultCreateModule {}
