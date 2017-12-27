import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SharedModule } from 'merit/shared/shared.module';

import { VaultSpendView } from './vault-spend';

/*
  ToDo: Work to get this lazy-loadable as possible.
*/
@NgModule({
  declarations: [
    VaultSpendView,
  ],
  imports: [
    IonicPageModule.forChild(VaultSpendView),
    SharedModule,
  ],
  providers: [
  ]
})
export class VaultSpendModule {}
