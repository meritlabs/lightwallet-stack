import { NgModule } from '@angular/core';
import { MomentModule } from 'angular2-moment/moment.module';
import { IonicPageModule } from 'ionic-angular';
import { SharedModule } from 'merit/shared/shared.module';
import { TxDetailsView } from 'merit/wallets/tx-details/tx-details';
import { ComponentsModule } from '../../../components/components.module';

@NgModule({
  declarations: [
    TxDetailsView
  ],
  imports: [
    IonicPageModule.forChild(TxDetailsView),
    SharedModule,
    MomentModule,
    ComponentsModule
  ]
})
export class TxDetailsViewModule {
}
