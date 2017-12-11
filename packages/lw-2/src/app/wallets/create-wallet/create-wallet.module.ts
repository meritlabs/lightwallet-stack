import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CreateWalletView } from 'merit/wallets/create-wallet/create-wallet';

@NgModule({
  declarations: [
    CreateWalletView,
  ],
  providers: [
  ],
  imports: [
    IonicPageModule.forChild(CreateWalletView),
  ],
})
export class CreateWalletComponentModule {}
