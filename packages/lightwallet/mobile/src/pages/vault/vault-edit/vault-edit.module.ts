import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VaultEditView } from './vault-edit';

@NgModule({
  declarations: [
    VaultEditView,
  ],
  imports: [
    IonicPageModule.forChild(VaultEditView),
  ],
})
export class VaultEditModule {}
