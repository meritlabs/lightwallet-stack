import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SendWalletView } from './send-wallet';

@NgModule({
  declarations: [
    SendWalletView,
  ],
  imports: [
    IonicPageModule.forChild(SendWalletView),
  ],
})
export class SensWalletModule {
}
