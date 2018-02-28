import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VaultView } from './vault';

@NgModule({
  declarations: [
    VaultView,
  ],
  imports: [
    IonicPageModule.forChild(VaultView),
  ]
})
export class VaultModule {}
