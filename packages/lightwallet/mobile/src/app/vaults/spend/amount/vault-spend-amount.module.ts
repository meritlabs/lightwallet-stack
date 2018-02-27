import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VaultSpendAmountView } from './vault-spend-amount';

@NgModule({
  declarations: [
    VaultSpendAmountView,
  ],
  imports: [
    IonicPageModule.forChild(VaultSpendAmountView)
  ]
})
export class VaultSpendAmountModule {
}
