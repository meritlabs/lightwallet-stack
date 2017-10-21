import { NgModule } from '@angular/core';
import { IonicComponentModule } from 'ionic-angular';
import { SelectLanguageModal } from './select-language';
import {ExternalLinkService} from "../../../../providers/external-link-service";

@NgModule({
  declarations: [
    SelectLanguageModal,
  ],
  providers: [
    ExternalLinkService
  ],
  imports: [
    IonicComponentModule.forChild(SelectLanguageModal),
  ],
})
export class SelectLanguageComponentModule {}
