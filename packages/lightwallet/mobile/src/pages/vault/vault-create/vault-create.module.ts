import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VaultCreateView } from './vault-create';

@NgModule({
  declarations: [
    VaultCreateView,
  ],
  imports: [
    IonicPageModule.forChild(VaultCreateView),
  ]
})
export class VaultCreateModule {}
