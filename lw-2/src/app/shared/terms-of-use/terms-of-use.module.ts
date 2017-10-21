import { NgModule } from '@angular/core';
import { IonicComponentModule } from 'ionic-angular';
import { TermsOfUseComponent } from './terms-of-use';

@NgModule({
  declarations: [
    TermsOfUseComponent,
  ],
  imports: [
    IonicComponentModule.forChild(TermsOfUseComponent),
  ],
})
export class TermsOfUseComponentModule {}
