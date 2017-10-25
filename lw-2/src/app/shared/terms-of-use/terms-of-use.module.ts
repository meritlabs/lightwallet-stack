import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TermsOfUseView } from './terms-of-use';

@NgModule({
  declarations: [
    TermsOfUseView,
  ],
  imports: [
    IonicPageModule.forChild(TermsOfUseView),
  ],
})
export class TermsOfUseComponentModule {}
