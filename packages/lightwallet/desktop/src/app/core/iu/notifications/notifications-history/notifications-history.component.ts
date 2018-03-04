import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-notifications-history',
  templateUrl: './notifications-history.component.html',
  styleUrls: ['./notifications-history.component.sass']
})
export class NotificationsHistoryComponent implements OnInit {
  constructor() {}
  ngOnInit() {}
  @Input() showHistory: boolean;
  @Input() notifications: Object[];
}
