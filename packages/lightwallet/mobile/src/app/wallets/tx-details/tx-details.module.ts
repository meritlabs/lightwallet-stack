import { NgModule } from '@angular/core';
import { MomentModule } from 'ngx-moment';
import { IonicPageModule } from 'ionic-angular';
import { TxDetailsView } from '@merit/mobile/app/wallets/tx-details/tx-details';
import { ClipModule } from 'ng2-clip';
import { ComponentsModule } from '../../../components/components.module';
import { CommonPipesModule } from '@merit/common/common-pipes.module';

@NgModule({
  declarations: [TxDetailsView],
  imports: [IonicPageModule.forChild(TxDetailsView), MomentModule, ComponentsModule, CommonPipesModule, ClipModule],
})
export class TxDetailsViewModule {}
