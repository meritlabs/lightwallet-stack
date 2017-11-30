import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SharedModule } from 'merit/shared/shared.module';

import { VaultSpendConfirmView } from './vault-spend-confirm';

/*
  ToDo: Work to get this lazy-loadable as possible. 
*/
@NgModule({
  declarations: [
    VaultSpendConfirmView,
  ],
  imports: [
    IonicPageModule.forChild(VaultSpendConfirmView),
    SharedModule,
  ],
  providers: [
  ]
})
export class VaultSpendConfirmModule {}