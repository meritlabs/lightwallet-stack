import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SharedModule } from 'merit/shared/shared.module';
import { VaultSpendConfirmView } from './vault-spend-confirm';

@NgModule({
  declarations: [
    VaultSpendConfirmView,
  ],
  imports: [
    IonicPageModule.forChild(VaultSpendConfirmView),
    SharedModule,
  ]
})
export class VaultSpendConfirmModule {
}