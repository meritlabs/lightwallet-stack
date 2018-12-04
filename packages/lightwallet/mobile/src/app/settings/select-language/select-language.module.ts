import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SelectLanguageModal } from '@merit/mobile/app/settings/select-language/select-language';

@NgModule({
  declarations: [SelectLanguageModal],
  imports: [IonicPageModule.forChild(SelectLanguageModal)],
})
export class SelectLanguageComponentModule {}
