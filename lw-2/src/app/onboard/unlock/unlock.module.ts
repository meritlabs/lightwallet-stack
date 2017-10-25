import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UnlockView } from './unlock';

@NgModule({
  declarations: [
    UnlockView,
  ],
  imports: [
    IonicPageModule.forChild(UnlockView),
  ],
})
export class UnlockComponentModule {}
