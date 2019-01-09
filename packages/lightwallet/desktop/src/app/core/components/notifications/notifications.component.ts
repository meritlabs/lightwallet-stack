import { Component, Input } from '@angular/core';
import { IRootAppState } from '@merit/common/reducers';
import {
  ClearNotificationsAction,
  INotification,
  MarkAllNotificationsAsReadAction,
} from '@merit/common/reducers/notifications.reducer';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.sass'],
})
export class NotificationsComponent {
  showHistory: boolean;
  @Input()
  notifications: INotification[];
  @Input()
  hasNewNotifications: boolean;

  constructor(private store: Store<IRootAppState>) {}

  onClear() {
    this.store.dispatch(new ClearNotificationsAction());
  }

  toggleHistory() {
    if (!this.showHistory && this.hasNewNotifications) {
      this.store.dispatch(new MarkAllNotificationsAsReadAction());
    }

    this.showHistory = !this.showHistory;
  }
}
