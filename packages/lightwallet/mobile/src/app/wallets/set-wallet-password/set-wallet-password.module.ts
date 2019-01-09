import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DirectivesModule } from '@merit/mobile/directives/directives.module';
import { SetWalletPasswordView } from './set-wallet-password';

@NgModule({
  declarations: [SetWalletPasswordView],
  imports: [IonicPageModule.forChild(SetWalletPasswordView), DirectivesModule],
})
export class SetWalletPasswordModule {}
