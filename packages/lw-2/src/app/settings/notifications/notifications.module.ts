import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NotificationsView } from 'merit/settings/notifications/notifications';
import { PushNotificationsService } from 'merit/core/notification/push-notification.service';
import { SharedModule } from 'merit/shared/shared.module';
import { EmailNotificationsService } from 'merit/core/notification/email-notification.service';


// This module manaages the sending of money.
// This is the first of three steps.
@NgModule({ 
  declarations: [
    NotificationsView 
  ],
  imports: [
    IonicPageModule.forChild(NotificationsView),
    SharedModule    
    ],
  providers: [
    PushNotificationsService,
    EmailNotificationsService 
  ],
  exports: [
  ]
})
export class NotificationsViewModule {}
