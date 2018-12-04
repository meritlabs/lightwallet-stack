import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SmsNotificationsModal } from './sms-notifications';

@NgModule({
  declarations: [SmsNotificationsModal],
  imports: [IonicPageModule.forChild(SmsNotificationsModal)],
})
export class SmsNotificationsModule {}
