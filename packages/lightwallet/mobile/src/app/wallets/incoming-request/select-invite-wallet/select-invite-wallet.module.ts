import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SelectInviteWalletModal } from './select-invite-wallet';

@NgModule({
  declarations: [
    SelectInviteWalletModal,
  ],
  imports: [
    IonicPageModule.forChild(SelectInviteWalletModal),
  ],
})
export class SelectInviteModule {
}
