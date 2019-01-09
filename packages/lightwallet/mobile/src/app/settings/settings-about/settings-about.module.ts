import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SettingsAboutView } from '@merit/mobile/app/settings/settings-about/settings-about';

@NgModule({
  declarations: [SettingsAboutView],
  imports: [IonicPageModule.forChild(SettingsAboutView)],
})
export class SettingsAboutViewModule {}
