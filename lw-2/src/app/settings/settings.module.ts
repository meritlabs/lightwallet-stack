import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SettingsView } from './settings';
import {ExternalLinkService} from "../../../providers/external-link-service";

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
