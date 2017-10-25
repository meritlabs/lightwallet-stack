import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CopayersView } from './copayers';
import {QRCodeModule} from "angular2-qrcode/lib/angular2-qrcode";

@NgModule({
  declarations: [
    CopayersView,
  ],
  imports: [
    QRCodeModule,
    IonicPageModule.forChild(CopayersView),
  ],
})
export class CopayersComponentModule {}
