import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SendSelectBindContactView } from './send-select-bind-contact';

@NgModule({
  declarations: [
    SendSelectBindContactView,
  ],
  imports: [
    IonicPageModule.forChild(SendSelectBindContactView),
  ],
})
export class SendSelectBindContactModule {}
