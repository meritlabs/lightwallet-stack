import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { INotification } from '@merit/common/reducers/notifications.reducer';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.sass']
})
export class NotificationsComponent {
  showHistory: boolean = false;
  @Input() notifications: INotification[];
  @Input() hasNewNotifications: boolean;
}
