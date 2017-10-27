import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CreateWalletView } from 'merit/wallets/create-wallet/create-wallet';
import { ConfigService } from "merit/shared/config.service";

@NgModule({
  declarations: [
    CreateWalletView,
  ],
  providers: [
    ConfigService
  ],
  imports: [
    IonicPageModule.forChild(CreateWalletView),
  ],
})
export class CreateWalletComponentModule {}
