import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DirectivesModule } from '@merit/mobile/directives/directives.module';
import { VaultEditView } from './vault-edit';

@NgModule({
  declarations: [VaultEditView],
  imports: [IonicPageModule.forChild(VaultEditView), DirectivesModule],
})
export class VaultEditModule {}
