import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VaultSpendView } from './vault-spend';

@NgModule({
  declarations: [
    VaultSpendView,
  ],
  imports: [
    IonicPageModule.forChild(VaultSpendView),
  ]
})
export class VaultSpendModule {
}
