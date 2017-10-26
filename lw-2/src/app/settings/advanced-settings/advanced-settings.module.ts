import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AdvancedSettingsView } from '@app/settings/advanced-settings/advanced-settings';

@NgModule({
  declarations: [
    AdvancedSettingsView,
  ],
  imports: [
    IonicPageModule.forChild(AdvancedSettingsView),
  ],
})
export class AdvancedSettingsComponentModule {}
