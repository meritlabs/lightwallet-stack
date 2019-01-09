import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { INotification } from '@merit/common/reducers/notifications.reducer';

@Component({
  selector: 'notifications-history',
  templateUrl: './notifications-history.component.html',
  styleUrls: ['./notifications-history.component.sass'],
  host: {
    '[class.show]': 'showHistory',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationsHistoryComponent {
  @Input()
  notifications: INotification[];
  @Input()
  showHistory: boolean;
  @Output()
  onClear: EventEmitter<void> = new EventEmitter<void>();

  clearAll() {
    this.onClear.emit();
  }
}
