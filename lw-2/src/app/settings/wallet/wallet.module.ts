import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WalletView } from 'merit/settings/wallet/wallet';
import { TouchIdModule } from 'merit/shared/touch-id/touch-id.module';
import { TouchIdService } from 'merit/shared/touch-id/touch-id.service';


@NgModule({
  declarations: [
    WalletView,
    TouchIdModule
  ],
  imports: [
    IonicPageModule.forChild(WalletView)
  ],
  providers: [
    TouchIdService
  ]
})
export class WalletComponentModule {}
