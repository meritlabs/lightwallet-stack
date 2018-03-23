import { Component, Input } from '@angular/core';

export interface INotificationMessage {
  status?: string;
  title: string;
  text: string;
}

@Component({
  selector: 'toast-notification',
  templateUrl: './toast-notification.component.html',
  styleUrls: ['./toast-notification.component.sass'],
  host: {
    '[class]': '\'notification__toast notification__toast--\' + message.status',
    '[hidden]': '!show'
  }
})
export class ToastNotificationComponent {
  @Input() show: boolean;
  @Input() message: INotificationMessage;
  @Input() duration: number = 3000;

  ngOnInit() {
    console.log('Toast is alive ~~~~~');
    // setTimeout(() => {
    //   this.show = false;
    // }, this.duration);
  }
}
