import { NgModule } from '@angular/core';
import { QRCodeModule } from 'angular2-qrcode';
import { IonicPageModule } from 'ionic-angular';
import { ReceiveView } from '@merit/mobile/app/transact/receive/receive';
import { ClipModule } from 'ng2-clip';
import { DirectivesModule } from '@merit/mobile/directives/directives.module';

@NgModule({
  declarations: [ReceiveView],
  imports: [QRCodeModule, ClipModule, IonicPageModule.forChild(ReceiveView), DirectivesModule],
})
export class ReceiveComponentModule {}
