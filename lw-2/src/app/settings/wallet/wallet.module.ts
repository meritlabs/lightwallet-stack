import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WalletView } from '@app/settings/wallet/wallet';

@NgModule({
  declarations: [
    WalletView,
  ],
  imports: [
    IonicPageModule.forChild(WalletView),
  ],
})
export class WalletComponentModule {}
