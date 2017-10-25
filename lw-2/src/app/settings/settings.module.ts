import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SettingsComponent } from './settings';
import {ExternalLinkService} from "../../../providers/external-link-service";

@NgModule({
  declarations: [
    SettingsComponent,
  ],
  providers: [
    ExternalLinkService
  ],
  imports: [
    IonicPageModule.forChild(SettingsComponent),
  ],
})
export class SettingsComponentModule {}
