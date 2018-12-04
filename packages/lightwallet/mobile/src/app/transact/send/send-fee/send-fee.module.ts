import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SendFeeView } from './send-fee';

@NgModule({
  declarations: [SendFeeView],
  imports: [IonicPageModule.forChild(SendFeeView)],
})
export class SendFeeModule {}
