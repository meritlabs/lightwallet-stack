import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CopayersComponent } from './copayers';
import {QRCodeModule} from "angular2-qrcode/lib/angular2-qrcode";

@NgModule({
  declarations: [
    CopayersComponent,
  ],
  imports: [
    QRCodeModule,
    IonicPageModule.forChild(CopayersComponent),
  ],
})
export class CopayersComponentModule {}
