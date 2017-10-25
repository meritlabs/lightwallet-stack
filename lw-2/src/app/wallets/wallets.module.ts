import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WalletsView } from './wallets';
import { MomentModule } from 'angular2-moment';

@NgModule({
  declarations: [
    WalletsView,
  ],
  imports: [
    MomentModule,
    IonicPageModule.forChild(WalletsView),
  ],
})
export class WalletsViewModule {}
