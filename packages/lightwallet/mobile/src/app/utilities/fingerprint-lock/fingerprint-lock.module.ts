import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FingerprintLockView } from './fingerprint-lock';

@NgModule({
  declarations: [
    FingerprintLockView
  ],
  imports: [
    IonicPageModule.forChild(FingerprintLockView),
  ]
})
export class FingerprintLockComponentModule {
}
