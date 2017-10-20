import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ReceivePage } from './receive';
import { MomentModule } from 'angular2-moment';
import { QRCodeModule } from 'angular2-qrcode';
import {ProfileService} from "../../../providers/profile-service";

@NgModule({
  declarations: [
    ReceivePage
  ],
  imports: [
    MomentModule,
    QRCodeModule,
    IonicPageModule.forChild(ReceivePage),
  ],
})
export class ReceivePageModule {}
