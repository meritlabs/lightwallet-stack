import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotificationsComponent implements OnInit {

  @Input()
  showHistory: boolean = false;
  notifications: Object[] = [
    {
      "title": "Success!",
      "status": "success",
      "date": "11:42 PM",
      "text": "Your transaction is confirmed!"
    },
    {
      "title": "Success!",
      "status": "success",
      "date": "11:42 PM",
      "text": "Your transaction is confirmed!"
    }
  ]
  constructor() {}
  ngOnInit() {}
  get hasNewNotifications() {
    if(this.notifications.length > 0) {
      return true;
    }else {
      return false;
    }
  }
}
