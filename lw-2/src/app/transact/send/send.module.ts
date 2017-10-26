import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SendView } from 'merit/transact/send/send';

@NgModule({
  declarations: [
    SendView,
  ],
  imports: [
    IonicPageModule.forChild(SendView),
  ],
})
export class SendComponentModule {}
