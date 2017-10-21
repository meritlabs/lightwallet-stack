import { NgModule } from '@angular/core';
import { IonicComponentModule } from 'ionic-angular';
import { CopayersComponent } from './copayers';
import {QRCodeModule} from "angular2-qrcode/lib/angular2-qrcode";

@NgModule({
  declarations: [
    CopayersComponent,
  ],
  imports: [
    QRCodeModule,
    IonicComponentModule.forChild(CopayersComponent),
  ],
})
export class CopayersComponentModule {}
