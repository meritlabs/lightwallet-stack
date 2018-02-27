import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VaultSpendConfirmView } from './vault-spend-confirm';

@NgModule({
  declarations: [
    VaultSpendConfirmView
  ],
  imports: [
    IonicPageModule.forChild(VaultSpendConfirmView)
  ]
})
export class VaultSpendConfirmModule {
}
