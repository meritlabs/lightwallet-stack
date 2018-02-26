import { NgModule } from '@angular/core';
import { QRCodeModule } from 'angular2-qrcode';
import { IonicPageModule } from 'ionic-angular';
import { ReceiveView } from 'merit/transact/receive/receive';
import { ClipModule } from 'ng2-clip'


@NgModule({
  declarations: [
    ReceiveView
  ],
  imports: [
    QRCodeModule,
    ClipModule,
    IonicPageModule.forChild(ReceiveView),
  ],
})
export class ReceiveComponentModule {
}
