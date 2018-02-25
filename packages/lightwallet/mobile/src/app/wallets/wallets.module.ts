import { NgModule } from '@angular/core';
import { MomentModule } from 'angular2-moment';
import { IonicPageModule } from 'ionic-angular';
import { WalletsView } from '@merit/mobile/app/wallets/wallets';

@NgModule({
  declarations: [
    WalletsView,
  ],
  imports: [
    MomentModule,
    IonicPageModule.forChild(WalletsView)
  ],
})
export class WalletsModule {
}
