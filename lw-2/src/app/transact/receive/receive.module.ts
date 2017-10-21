import { NgModule } from '@angular/core';
import { IonicComponentModule } from 'ionic-angular';
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
    IonicComponentModule.forChild(ReceiveComponent),
  ],
})
export class ReceiveComponentModule {}
