import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FingerprintLockView } from "./fingerprint-lock";
import { TouchIdService } from 'merit/shared/touch-id/touch-id.service';


@NgModule({
  declarations: [
    FingerprintLockView
  ],
  imports: [
    IonicPageModule.forChild(FingerprintLockView),
  ],
  providers: [
    TouchIdService
  ]
})
export class FingerprintLockComponentModule {}
