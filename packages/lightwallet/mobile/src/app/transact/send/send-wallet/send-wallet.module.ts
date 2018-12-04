import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SendWalletView } from './send-wallet';
import { CommonPipesModule } from '@merit/common/common-pipes.module';

@NgModule({
  declarations: [SendWalletView],
  imports: [CommonPipesModule, IonicPageModule.forChild(SendWalletView)],
})
export class SensWalletModule {}
