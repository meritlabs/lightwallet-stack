import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PinLockView } from './pin-lock';

@NgModule({
  declarations: [PinLockView],
  imports: [IonicPageModule.forChild(PinLockView)],
})
export class PinLockModule {}
