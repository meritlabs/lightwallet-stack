import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SettingsAboutComponent } from './settings-about';
import {ExternalLinkService} from "../../../../providers/external-link-service";

@NgModule({
  declarations: [
    SettingsAboutComponent,
  ],
  providers: [
    ExternalLinkService
  ],
  imports: [
    IonicPageModule.forChild(SettingsAboutComponent),
  ],
})
export class SettingsAboutComponentModule {}
