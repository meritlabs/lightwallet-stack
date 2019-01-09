import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SendViaView } from './send-via';

@NgModule({
  declarations: [SendViaView],
  imports: [IonicPageModule.forChild(SendViaView)],
})
export class SendViaModule {}
