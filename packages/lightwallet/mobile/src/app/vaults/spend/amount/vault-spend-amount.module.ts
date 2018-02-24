import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SharedModule } from 'merit/shared/shared.module';
import { VaultSpendAmountView } from './vault-spend-amount';

@NgModule({
  declarations: [
    VaultSpendAmountView,
  ],
  imports: [
    IonicPageModule.forChild(VaultSpendAmountView),
    SharedModule,
  ]
})
export class VaultSpendAmountModule {
}