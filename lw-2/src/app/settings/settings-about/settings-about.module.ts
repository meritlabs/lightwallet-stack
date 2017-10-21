import { NgModule } from '@angular/core';
import { IonicComponentModule } from 'ionic-angular';
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
    IonicComponentModule.forChild(SettingsAboutComponent),
  ],
})
export class SettingsAboutComponentModule {}
