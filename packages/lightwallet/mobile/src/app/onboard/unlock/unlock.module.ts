import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UnlockView } from '@merit/mobile/app/onboard/unlock/unlock';
import { CommonPipesModule } from '@merit/common/common-pipes.module';
import { DirectivesModule } from '@merit/mobile/directives/directives.module';

@NgModule({
  declarations: [UnlockView],
  imports: [IonicPageModule.forChild(UnlockView), CommonPipesModule, DirectivesModule],
})
export class UnlockViewModule {}
