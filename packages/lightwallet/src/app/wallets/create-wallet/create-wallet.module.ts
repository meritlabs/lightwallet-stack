import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CreateWalletView } from 'merit/wallets/create-wallet/create-wallet';

@NgModule({
  declarations: [
    CreateWalletView,
  ],
  imports: [
    IonicPageModule.forChild(CreateWalletView),
  ],
})
export class CreateWalletComponentModule {
}
