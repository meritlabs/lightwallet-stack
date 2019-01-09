import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AliasView } from '@merit/mobile/app/onboard/alias/alias';
import { DirectivesModule } from '@merit/mobile/directives/directives.module';

@NgModule({
  declarations: [AliasView],
  imports: [IonicPageModule.forChild(AliasView), DirectivesModule],
})
export class AliasViewModule {}
