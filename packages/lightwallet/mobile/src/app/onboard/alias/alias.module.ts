import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AliasView } from '@merit/mobile/app/onboard/alias/alias';
import { WalletsModule } from '@merit/mobile/app/wallets/wallets.module';

/*
  This module represents the unlock wallet page, and is the f
*/
@NgModule({
  declarations: [
    AliasView,
  ],
  providers: [],
  imports: [
    IonicPageModule.forChild(AliasView),
    WalletsModule
  ],
})
export class AliasViewModule {
}
