import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DirectivesModule } from '@merit/mobile/directives/directives.module';
import { SendAmountView } from './send-amount';
import { CommonPipesModule } from '@merit/common/common-pipes.module';

@NgModule({
  declarations: [SendAmountView],
  imports: [IonicPageModule.forChild(SendAmountView), CommonPipesModule, DirectivesModule],
})
export class SendAmountModule {}
