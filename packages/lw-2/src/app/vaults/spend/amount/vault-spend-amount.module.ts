import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SharedModule } from 'merit/shared/shared.module';

import { VaultSpendAmountView } from './vault-spend-amount';

/*
  ToDo: Work to get this lazy-loadable as possible. 
*/
@NgModule({
  declarations: [
    VaultSpendAmountView,
  ],
  imports: [
    IonicPageModule.forChild(VaultSpendAmountView),
    SharedModule,
  ],
  providers: [
  ]
})
export class VaultSpendAmountModule {}