import { Component, ComponentRef, Input, ViewContainerRef } from '@angular/core';

export interface INotificationMessage {
  status?: string;
  title?: string;
  text: string;
}

@Component({
  selector: 'toast-notification',
  templateUrl: './toast-notification.component.html',
  styleUrls: ['./toast-notification.component.sass'],
  host: {
    '[class]': 'message.status',
    '[hidden]': '!show'
  }
})
export class ToastNotificationComponent {
  @Input() show: boolean;
  @Input() message: INotificationMessage;
  @Input() duration: number = 3000;

  destroy: Function;

  ngOnInit() {
    setTimeout(() => {
      this.dismiss();
    }, this.duration);
  }

  dismiss() {
    this.show = false;
    this.destroy && this.destroy();
  }
}
