import { NgModule } from '@angular/core';
import { MomentModule } from 'angular2-moment';
import { IonicPageModule } from 'ionic-angular';
import { WalletsView } from '@merit/mobile/app/wallets/wallets';
import { CommonPipesModule } from '@merit/common/common-pipes.module';

@NgModule({
  declarations: [
    WalletsView
  ],
  imports: [
    MomentModule,
    CommonPipesModule,
    IonicPageModule.forChild(WalletsView)
  ],
})
export class WalletsModule {
}
