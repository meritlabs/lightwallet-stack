import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SettingsView } from 'merit/settings/settings';
import { InAppBrowser } from '@ionic-native/in-app-browser';  
import { EmailService } from 'merit/shared/email.service';
import { WalletsModule } from 'merit/wallets/wallets.module'; 


// Settings 
@NgModule({
  declarations: [
    SettingsView,
  ],
  providers: [
    InAppBrowser,
    EmailService
  ],
  imports: [
    WalletsModule, 
    IonicPageModule.forChild(SettingsView),
  ],
})
export class SettingsComponentModule {}
