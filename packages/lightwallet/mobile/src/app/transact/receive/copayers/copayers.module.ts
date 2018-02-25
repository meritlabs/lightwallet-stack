import { NgModule } from '@angular/core';
import { QRCodeModule } from 'angular2-qrcode/lib/angular2-qrcode';
import { IonicPageModule } from 'ionic-angular';
import { CopayersView } from '@merit/mobile/app/transact/receive/copayers/copayers';

@NgModule({
  declarations: [
    CopayersView,
  ],
  imports: [
    QRCodeModule,
    IonicPageModule.forChild(CopayersView),
  ],
})
export class CopayersComponentModule {
}
