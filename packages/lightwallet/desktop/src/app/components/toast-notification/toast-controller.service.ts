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
}
