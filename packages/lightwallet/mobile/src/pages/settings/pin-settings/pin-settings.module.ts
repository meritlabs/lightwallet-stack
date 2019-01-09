import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PinSettingsView } from './pin-settings';

@NgModule({
  declarations: [PinSettingsView],
  imports: [IonicPageModule.forChild(PinSettingsView)],
})
export class PinSettingsModule {}
