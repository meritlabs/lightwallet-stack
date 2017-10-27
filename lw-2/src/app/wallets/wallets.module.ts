import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WalletsView } from 'merit/wallets/wallets';
import { MomentModule } from 'angular2-moment';
import { BwcService } from 'merit/core/bwc.service';
import { TxFormatService } from 'merit/transact/tx-format.service';


@NgModule({
  declarations: [
    WalletsView,
  ],
  providers: [
    BwcService,
    TxFormatService
  ]
  ,
  imports: [
    MomentModule,
    IonicPageModule.forChild(WalletsView),
  ],
})
export class WalletsViewModule {}
