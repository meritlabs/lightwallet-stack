import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VaultCreateView } from './vault-create';
import { VaultService } from '@merit/common/services/vault.service';

@NgModule({
  declarations: [
    VaultCreateView,
  ],
  imports: [
    IonicPageModule.forChild(VaultCreateView),
  ],
  providers: [
    VaultService
  ]
})
export class VaultCreateModule {}
