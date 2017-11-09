import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CopayersPage } from './copayers';
import {QRCodeModule} from "angular2-qrcode/lib/angular2-qrcode";

@NgModule({
  declarations: [
    CopayersPage,
  ],
  imports: [
    QRCodeModule,
    IonicPageModule.forChild(CopayersPage),
  ],
})
export class CopayersPageModule {}
