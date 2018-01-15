import { NgModule } from '@angular/core';
import { MomentModule } from 'angular2-moment';
import { IonicPageModule } from 'ionic-angular';
import { VaultsView } from 'merit/vaults/vaults';
import { WalletsView } from 'merit/wallets/wallets';

@NgModule({
  declarations: [
    WalletsView,
    VaultsView
  ],
  imports: [
    MomentModule,
    IonicPageModule.forChild(WalletsView)
  ],
})
export class WalletsModule {
}
