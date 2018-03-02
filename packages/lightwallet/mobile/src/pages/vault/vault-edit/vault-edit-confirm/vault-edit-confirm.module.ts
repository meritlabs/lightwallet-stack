import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VaultEditConfirmView } from './vault-edit-confirm';

@NgModule({
  declarations: [
    VaultEditConfirmView,
  ],
  imports: [
    IonicPageModule.forChild(VaultEditConfirmView),
  ],
})
export class VaultEditConfirmModule {}
