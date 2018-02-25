import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UnlockView } from '@merit/mobile/app/onboard/unlock/unlock';
import { WalletsModule } from '@merit/mobile/app/wallets/wallets.module';

/*
  This module represents the unlock wallet page, and is the f
*/
@NgModule({
  declarations: [
    UnlockView,
  ],
  providers: [],
  imports: [
    IonicPageModule.forChild(UnlockView),
    WalletsModule
  ],
})
export class UnlockViewModule {
}
