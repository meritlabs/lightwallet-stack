import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ReceiveView } from '@app/transact/receive/receive';
import { MomentModule } from 'angular2-moment';
import { QRCodeModule } from 'angular2-qrcode';
import { ProfileService } from "@app/core/profile.service";

@NgModule({
  declarations: [
    ReceiveView
  ],
  imports: [
    MomentModule,
    QRCodeModule,
    IonicPageModule.forChild(ReceiveView),
  ],
})
export class ReceiveComponentModule {}
