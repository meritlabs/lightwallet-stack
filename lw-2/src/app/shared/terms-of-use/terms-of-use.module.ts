import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TermsOfUseComponent } from './terms-of-use';

@NgModule({
  declarations: [
    TermsOfUseComponent,
  ],
  imports: [
    IonicPageModule.forChild(TermsOfUseComponent),
  ],
})
export class TermsOfUseComponentModule {}
