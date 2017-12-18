import { NgModule } from '@angular/core';
import { PollingNotificationsService } from './polling-notification.service';
import { PushNotificationsService } from "./push-notification.service";
import { EmailNotificationsService } from "./email-notification.service";

// Settings 
@NgModule({
  declarations: [
  ],
  providers: [
    PollingNotificationsService,
    PushNotificationsService,
    EmailNotificationsService
  ],
  imports: [
  ],
})
export class NotificationModule {}
