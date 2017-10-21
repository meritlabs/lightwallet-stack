import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
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
    IonicPageModule.forChild(SelectLanguageModal),
  ],
})
export class SelectLanguagePageModule {}
