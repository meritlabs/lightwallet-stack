import { NgModule } from '@angular/core';
import { MomentModule } from 'angular2-moment';
import { IonicPageModule } from 'ionic-angular';
import { SelectWalletModal } from 'merit/transact/select-wallet/select-wallet';

@NgModule({
  declarations: [
    SelectWalletModal,
  ],
  imports: [
    MomentModule,
    IonicPageModule.forChild(SelectWalletModal),
  ],
})
export class SelectWalletComponentModule {
}
