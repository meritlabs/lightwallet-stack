import { Injectable } from '@angular/core';
import { DOMController } from '@merit/desktop/app/components/dom.controller';
import {
  INotificationMessage,
  ToastNotificationComponent
} from '@merit/desktop/app/components/toast-notification/toast-notification.component';

@Injectable()
export class ToastControllerService {
  constructor(private domCtrl: DOMController) {}

  create(message: INotificationMessage): ToastNotificationComponent {
    return this.domCtrl.create(ToastNotificationComponent, { message, show: true });
  }

  error(text: string): ToastNotificationComponent {
    return this.create({
      status: 'error',
      title: 'Error',
      text
    });
  }

  success(text: string): ToastNotificationComponent {
    return this.create({
      status: 'success',
      title: 'Success',
      text
    });
  }
}
