import { Component, Input } from '@angular/core';
import { INotification } from '@merit/common/reducers/notifications.reducer';

@Component({
  selector: 'notifications-history',
  templateUrl: './notifications-history.component.html',
  styleUrls: ['./notifications-history.component.sass'],
  host: {
    '[class.show]': 'showHistory'
  }
})
export class NotificationsHistoryComponent {
  @Input() notifications: INotification[];
  @Input() showHistory: boolean;

  clearAll() {
    
  }
}
