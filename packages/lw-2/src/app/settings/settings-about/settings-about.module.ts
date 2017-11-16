import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SettingsAboutView } from 'merit/settings/settings-about/settings-about';
import { AppService } from "merit/core/app-settings.service";
import { InAppBrowser } from '@ionic-native/in-app-browser';

@NgModule({
  declarations: [
    SettingsAboutView,
  ],
  providers: [
    InAppBrowser,
    AppService
  ],
  imports: [
    IonicPageModule.forChild(SettingsAboutView),
  ],
})
export class SettingsAboutComponentModule {}
