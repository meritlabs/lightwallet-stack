import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VaultSpendView } from './vault-spend';
import { ComponentsModule } from '@merit/mobile/components/components.module';

@NgModule({
  declarations: [
    VaultSpendView,
  ],
  imports: [
    IonicPageModule.forChild(VaultSpendView),
    ComponentsModule
  ],
})
export class VaultSpendModule {}
