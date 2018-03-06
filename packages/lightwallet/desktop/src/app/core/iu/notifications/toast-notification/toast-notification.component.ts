import { Component, OnInit, Input } from '@angular/core';

type INotification = {
  status: string,
  title: string,
  text: string,
};

@Component({
  selector: 'app-toast-notification',
  templateUrl: './toast-notification.component.html',
  styleUrls: ['./toast-notification.component.sass']
})
export class ToastNotificationComponent implements OnInit {
  constructor() {}
  ngOnInit() {}
  @Input() show: boolean = false;
  @Input() message: INotification = {
    "status": null,
    "title": null,
    "text": null
  };
}
