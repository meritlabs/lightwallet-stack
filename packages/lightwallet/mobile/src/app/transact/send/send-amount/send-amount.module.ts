import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SendAmountView } from './send-amount';
import { CommonPipesModule } from '@merit/common/common-pipes.module';

@NgModule({
  declarations: [
    SendAmountView,
  ],
  imports: [
    IonicPageModule.forChild(SendAmountView),
    CommonPipesModule
  ],
})
export class SendAmountModule {
}
