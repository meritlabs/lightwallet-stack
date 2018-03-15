import { Component, ViewEncapsulation } from '@angular/core';
import { WebPushNotificationsService } from '@merit/common/services/web-push-notifications.service';

@Component({
  selector: 'merit-lw',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent {

  constructor(pushNotifications: WebPushNotificationsService) {}

}
