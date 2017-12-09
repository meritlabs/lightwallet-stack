import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SelectWalletModal } from 'merit/transact/select-wallet/select-wallet';
import { MomentModule } from 'angular2-moment';

@NgModule({
  declarations: [
    SelectWalletModal,
  ],
  imports: [
    MomentModule,
    IonicPageModule.forChild(SelectWalletModal),
  ],
})
export class SelectWalletComponentModule {}
