import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SetWalletPasswordView } from './set-wallet-password';

@NgModule({
  declarations: [
    SetWalletPasswordView,
  ],
  imports: [
    IonicPageModule.forChild(SetWalletPasswordView),
  ],
})
export class SetWalletPasswordModule {
}
