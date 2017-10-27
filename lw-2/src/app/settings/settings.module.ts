import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SettingsView } from 'merit/settings/settings';
import { ExternalLinkService } from "merit/shared/external-link.service";

// Settings 
@NgModule({
  declarations: [
    SettingsView,
  ],
  providers: [
    ExternalLinkService
  ],
  imports: [
    IonicPageModule.forChild(SettingsView),
  ],
})
export class SettingsComponentModule {}
