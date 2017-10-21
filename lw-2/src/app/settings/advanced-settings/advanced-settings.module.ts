import { NgModule } from '@angular/core';
import { IonicComponentModule } from 'ionic-angular';
import { AdvancedSettingsComponent } from './advanced-settings';

@NgModule({
  declarations: [
    AdvancedSettingsComponent,
  ],
  imports: [
    IonicComponentModule.forChild(AdvancedSettingsComponent),
  ],
})
export class AdvancedSettingsComponentModule {}
