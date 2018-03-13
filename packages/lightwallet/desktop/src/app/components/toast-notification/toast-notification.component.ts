import { Component, Input } from '@angular/core';

export interface INotificationMessage {
  status: string;
  title: string;
  text: string;
}

@Component({
  selector: 'toast-notification',
  templateUrl: './toast-notification.component.html',
  styleUrls: ['./toast-notification.component.sass']
})
export class ToastNotificationComponent {
  @Input() show: boolean;
  @Input() message: INotificationMessage = {
    status: null,
    title: null,
    text: null
  };
}
