import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VaultView } from './vault';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    VaultView,
  ],
  imports: [
    IonicPageModule.forChild(VaultView),
    ComponentsModule
  ]
})
export class VaultModule {}
