import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ReceiveView } from './receive';
import { MomentModule } from 'angular2-moment';
import { QRCodeModule } from 'angular2-qrcode';
import {ProfileService} from "../../../providers/profile-service";

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
