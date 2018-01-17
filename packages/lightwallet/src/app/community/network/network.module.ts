import { NgModule } from '@angular/core';
import { Clipboard } from '@ionic-native/clipboard';
import { SocialSharing } from '@ionic-native/social-sharing';
import { MomentModule } from 'angular2-moment/moment.module';
import { IonicPageModule } from 'ionic-angular';
import { NetworkView } from 'merit/community/network/network';
import { WalletService } from 'merit/wallets/wallet.service';
import { ClipModule } from 'ng2-clip'


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
export class NetworkViewModule {
}
