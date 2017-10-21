import { NgModule } from '@angular/core';
import { IonicComponentModule } from 'ionic-angular';
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
    IonicComponentModule.forChild(SettingsComponent),
  ],
})
export class SettingsComponentModule {}
