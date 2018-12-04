import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SettingsView } from '@merit/mobile/app/settings/settings';

@NgModule({
  declarations: [SettingsView],
  imports: [IonicPageModule.forChild(SettingsView)],
})
export class SettingsComponentModule {}
