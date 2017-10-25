import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ReceiveComponent } from './receive';
import { MomentModule } from 'angular2-moment';
import { QRCodeModule } from 'angular2-qrcode';
import {ProfileService} from "../../../providers/profile-service";

@NgModule({
  declarations: [
    ReceiveComponent
  ],
  imports: [
    MomentModule,
    QRCodeModule,
    IonicPageModule.forChild(ReceiveComponent),
  ],
})
export class ReceiveComponentModule {}
