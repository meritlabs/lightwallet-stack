import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SendView } from './send';

@NgModule({
  declarations: [
    SendView,
  ],
  imports: [
    IonicPageModule.forChild(SendView),
  ],
})
export class SendComponentModule {}
