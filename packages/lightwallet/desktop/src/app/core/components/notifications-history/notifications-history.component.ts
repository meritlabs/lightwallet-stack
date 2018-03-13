import { Component, Input } from '@angular/core';

@Component({
  selector: 'notifications-history',
  templateUrl: './notifications-history.component.html',
  styleUrls: ['./notifications-history.component.sass']
})
export class NotificationsHistoryComponent {
  @Input() showHistory: boolean;
  @Input() notifications: Object[];
}
