import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-toast-notification',
  templateUrl: './toast-notification.component.html',
  styleUrls: ['./toast-notification.component.sass']
})
export class ToastNotificationComponent implements OnInit {
  constructor() {}
  ngOnInit() {}
  @Input() show: boolean = false;
}
