import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NetworkView } from 'merit/community/network/network';
import { MomentModule } from "angular2-moment/moment.module";
import { Clipboard } from '@ionic-native/clipboard';
import { ClipboardModule } from 'ngx-clipboard';
import { SocialSharing } from '@ionic-native/social-sharing';
import { WalletService } from "merit/wallets/wallet.service";


@NgModule({
  declarations: [
    NetworkView,
  ],
  imports: [
    MomentModule,
    ClipboardModule,
    IonicPageModule.forChild(NetworkView),
  ],
  providers: [
    SocialSharing,
    Clipboard,
    WalletService
  ]
})
export class NetworkViewModule {}
