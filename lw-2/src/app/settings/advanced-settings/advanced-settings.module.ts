import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AdvancedSettingsComponent } from './advanced-settings';

@NgModule({
  declarations: [
    AdvancedSettingsComponent,
  ],
  imports: [
    IonicPageModule.forChild(AdvancedSettingsComponent),
  ],
})
export class AdvancedSettingsComponentModule {}
