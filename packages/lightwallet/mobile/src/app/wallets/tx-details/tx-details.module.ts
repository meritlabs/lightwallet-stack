import { NgModule } from '@angular/core';
import { MomentModule } from 'angular2-moment/moment.module';
import { IonicPageModule } from 'ionic-angular';
import { TxDetailsView } from '@merit/mobile/app/wallets/tx-details/tx-details';
import { ComponentsModule } from '../../../components/components.module';
import { CommonPipesModule } from '@merit/common/common-pipes.module';

@NgModule({
  declarations: [
    TxDetailsView
  ],
  imports: [
    IonicPageModule.forChild(TxDetailsView),
    MomentModule,
    ComponentsModule,
    CommonPipesModule
  ]
})
export class TxDetailsViewModule {
}
