import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SelectLanguageModal } from '@app/settings/select-language/select-language';
import { ExternalLinkService } from "@app/shared/external-link.service";

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
