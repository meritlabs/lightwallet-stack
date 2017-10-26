import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SelectWalletModal } from '@app/transact/select-wallet/select-wallet';

@NgModule({
  declarations: [
    SelectWalletModal,
  ],
  imports: [
    IonicPageModule.forChild(SelectWalletModal),
  ],
})
export class SelectWalletComponentModule {}
