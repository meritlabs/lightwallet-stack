import { NgModule } from '@angular/core';
import { MomentModule } from 'ngx-moment';
import { IonicPageModule } from 'ionic-angular';
import { SelectWalletModal } from '@merit/mobile/app/transact/select-wallet/select-wallet';
import { CommonPipesModule } from '@merit/common/common-pipes.module';

@NgModule({
  declarations: [SelectWalletModal],
  imports: [MomentModule, CommonPipesModule, IonicPageModule.forChild(SelectWalletModal)],
})
export class SelectWalletComponentModule {}
