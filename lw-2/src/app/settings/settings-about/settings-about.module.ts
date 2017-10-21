import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SettingsAboutPage } from './settings-about';
import {ExternalLinkService} from "../../../../providers/external-link-service";

@NgModule({
  declarations: [
    SettingsAboutPage,
  ],
  providers: [
    ExternalLinkService
  ],
  imports: [
    IonicPageModule.forChild(SettingsAboutPage),
  ],
})
export class SettingsAboutPageModule {}
