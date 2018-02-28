import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AliasView } from '@merit/mobile/app/onboard/alias/alias';

@NgModule({
  declarations: [
    AliasView,
  ],
  imports: [
    IonicPageModule.forChild(AliasView)
  ],
})
export class AliasViewModule {
}
