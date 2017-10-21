import { NgModule } from '@angular/core';
import { IonicComponentModule } from 'ionic-angular';
import { SelectWalletModal } from './select-wallet';

@NgModule({
  declarations: [
    SelectWalletModal,
  ],
  imports: [
    IonicComponentModule.forChild(SelectWalletModal),
  ],
})
export class SelectWalletComponentModule {}
