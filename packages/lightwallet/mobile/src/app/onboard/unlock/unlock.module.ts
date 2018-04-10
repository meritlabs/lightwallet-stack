import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UnlockView } from '@merit/mobile/app/onboard/unlock/unlock';
import { CommonPipesModule } from '@merit/common/common-pipes.module';

@NgModule({
  declarations: [
    UnlockView,
  ],
  imports: [
    IonicPageModule.forChild(UnlockView),
    CommonPipesModule
  ],
})
export class UnlockViewModule {
}
