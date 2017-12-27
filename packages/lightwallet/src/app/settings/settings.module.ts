import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SettingsView } from 'merit/settings/settings';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { WalletsModule } from 'merit/wallets/wallets.module';
import { NotificationsViewModule } from 'merit/settings/notifications/notifications.module';


// Settings
@NgModule({
  declarations: [
    SettingsView,
  ],
  providers: [
    InAppBrowser
  ],
  imports: [
    WalletsModule,
    IonicPageModule.forChild(SettingsView),
    NotificationsViewModule
  ],
})
export class SettingsComponentModule {}
