import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CreateWalletView } from '@merit/mobile/app/wallets/create-wallet/create-wallet';
import { DirectivesModule } from '@merit/mobile/directives/directives.module';

@NgModule({
  declarations: [CreateWalletView],
  imports: [IonicPageModule.forChild(CreateWalletView), DirectivesModule],
})
export class CreateWalletComponentModule {}
