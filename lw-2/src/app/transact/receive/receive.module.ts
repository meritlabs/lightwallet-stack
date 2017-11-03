import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ReceiveView } from 'merit/transact/receive/receive';
import { MomentModule } from 'angular2-moment';
import { QRCodeModule } from 'angular2-qrcode';
import { ProfileService } from "merit/core/profile.service";
import {WalletsModule} from "../../wallets/wallets.module";
import { SocialSharing } from '@ionic-native/social-sharing';
import { Clipboard } from '@ionic-native/clipboard';
import {ClipboardModule} from 'ngx-clipboard';


@NgModule({
  declarations: [
    ReceiveView
  ],
  providers: [
    SocialSharing,
    Clipboard
  ],
  imports: [
    MomentModule,
    QRCodeModule,
    ClipboardModule,
    WalletsModule,
    IonicPageModule.forChild(ReceiveView),
  ],
})
export class ReceiveComponentModule {}
