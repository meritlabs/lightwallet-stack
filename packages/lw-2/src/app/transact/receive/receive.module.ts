import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ReceiveView } from 'merit/transact/receive/receive';
import { QRCodeModule } from 'angular2-qrcode';
import { ProfileService } from "merit/core/profile.service";
import { WalletsModule } from "merit/wallets/wallets.module";
import { SocialSharing } from '@ionic-native/social-sharing';
import { Clipboard } from '@ionic-native/clipboard';
import { ClipModule } from 'ng2-clip'


@NgModule({
  declarations: [
    ReceiveView
  ],
  providers: [
    SocialSharing,
    Clipboard
  ],
  imports: [
    QRCodeModule,
    ClipModule,
    WalletsModule,
    IonicPageModule.forChild(ReceiveView),
  ],
})
export class ReceiveComponentModule {}
