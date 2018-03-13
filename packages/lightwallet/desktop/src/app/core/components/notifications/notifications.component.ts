import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotificationsComponent {

  @Input()
  showHistory: boolean = false;
  notifications: Object[] = [
    {
      'title': 'Success!',
      'status': 'success',
      'date': '11:42 PM',
      'text': 'Your transaction is confirmed!'
    },
    {
      'title': 'Success!',
      'status': 'success',
      'date': '11:42 PM',
      'text': 'Your transaction is confirmed!'
    }
  ];

  get hasNewNotifications() {
    return this.notifications.length > 0;
  }
}
