import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SelectLanguageModal } from 'merit/settings/select-language/select-language';


@NgModule({
  declarations: [
    SelectLanguageModal,
  ],
  providers: [],
  imports: [
    IonicPageModule.forChild(SelectLanguageModal),
  ],
})
export class SelectLanguageComponentModule {
}
