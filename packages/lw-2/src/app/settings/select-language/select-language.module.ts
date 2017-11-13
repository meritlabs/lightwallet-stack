import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SelectLanguageModal } from 'merit/settings/select-language/select-language';
import { ExternalLinkService } from "merit/shared/external-link.service";

@NgModule({
  declarations: [
    SelectLanguageModal,
  ],
  providers: [
    ExternalLinkService
  ],
  imports: [
    IonicPageModule.forChild(SelectLanguageModal),
  ],
})
export class SelectLanguageComponentModule {}
