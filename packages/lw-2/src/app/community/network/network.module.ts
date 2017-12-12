import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NetworkView } from 'merit/community/network/network';
import { MomentModule } from "angular2-moment/moment.module";
import { Clipboard } from '@ionic-native/clipboard';
import { ClipModule } from 'ng2-clip'
import { SocialSharing } from '@ionic-native/social-sharing';
import { WalletService } from "merit/wallets/wallet.service";


@NgModule({
  declarations: [
    NetworkView,
  ],
  imports: [
    MomentModule,
    ClipModule,
    IonicPageModule.forChild(NetworkView),
  ],
  providers: [
    SocialSharing,
    Clipboard,
    WalletService
  ]
})
export class NetworkViewModule {}
