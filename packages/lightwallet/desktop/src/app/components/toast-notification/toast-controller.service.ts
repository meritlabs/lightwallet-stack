import { Injectable } from '@angular/core';
import {
  IMeritToastConfig,
  ToastControllerService as ToastControllerServiceBase
} from '@merit/common/services/toast-controller.service';
import { DOMController } from '@merit/desktop/app/components/dom.controller';
import { ToastNotificationComponent } from '@merit/desktop/app/components/toast-notification/toast-notification.component';

@Injectable()
export class ToastControllerService extends ToastControllerServiceBase {
  constructor(private domCtrl: DOMController) {
    super();
  }

  create(config: IMeritToastConfig): ToastNotificationComponent {
    return this.domCtrl.create(ToastNotificationComponent, config);
  }

  error(message: string): ToastNotificationComponent {
    return this.create({
      cssClass: 'error',
      title: 'Error',
      message
    });
  }

  success(message: string): ToastNotificationComponent {
    return this.create({
      cssClass: 'success',
      title: 'Success',
      message
    });
  }
}
