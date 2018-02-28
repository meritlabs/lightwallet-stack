import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VaultView } from './vault';
import { VaultService } from '@merit/common/services/vault.service';

@NgModule({
  declarations: [
    VaultView,
  ],
  imports: [
    IonicPageModule.forChild(VaultView),
  ],
  providers: [
    VaultService
  ]
})
export class VaultModule {}
