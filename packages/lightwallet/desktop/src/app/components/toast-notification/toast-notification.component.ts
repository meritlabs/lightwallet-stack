import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { IDynamicComponent } from '@merit/desktop/app/components/dom.controller';

export interface INotificationMessage {
  status?: string;
  title?: string;
  text: string;
}

export interface IToastNotificationConfig {
  message: INotificationMessage;
  show: boolean;
  duration?: number;
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
export class ToastNotificationComponent implements IDynamicComponent, OnInit, OnDestroy {
  @Input() show: boolean;
  @Input() message: INotificationMessage;
  @Input() duration: number = 3000;

  destroy: Function;
  private timeout: any;

  ngOnInit() {
    this.timeout = setTimeout(() => {
      this.dismiss();
    }, this.duration);
  }

  ngOnDestroy() {
    this.timeout = void 0;
  }

  init(config: any) {
    this.message = config.message;
    this.show = config.show;
  }

  dismiss() {
    this.show = false;
    this.destroy && this.destroy();
  }
}
