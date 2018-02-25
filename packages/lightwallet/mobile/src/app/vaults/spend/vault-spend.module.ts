import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SharedModule } from '@merit/mobile/app/shared/shared.module';
import { VaultSpendView } from './vault-spend';

@NgModule({
  declarations: [
    VaultSpendView,
  ],
  imports: [
    IonicPageModule.forChild(VaultSpendView),
    SharedModule,
  ]
})
export class VaultSpendModule {
}
