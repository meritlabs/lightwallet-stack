import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SettingsAboutView } from 'merit/settings/settings-about/settings-about';
import { ExternalLinkService } from "@app/shared/external-link.service";

@NgModule({
  declarations: [
    SettingsAboutView,
  ],
  providers: [
    ExternalLinkService
  ],
  imports: [
    IonicPageModule.forChild(SettingsAboutView),
  ],
})
export class SettingsAboutComponentModule {}
