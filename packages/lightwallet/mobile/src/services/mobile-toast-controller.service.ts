import { Injectable } from '@angular/core';
import { IMeritToastConfig, ToastControllerService } from '../../../common/services/toast-controller.service';
import { ToastController } from 'ionic-angular/components/toast/toast-controller';
import { ToastOptions } from 'ionic-angular/components/toast/toast-options';
import { Toast } from 'ionic-angular/components/toast/toast';

export const DefaultToastConfig: Partial<IMeritToastConfig> = {
  duration: 3000,
  position: 'top',
  cssClass: 'toast-message',
  showCloseButton: true,
};

@Injectable()
export class MobileToastControllerService implements ToastControllerService {
  constructor(private toastCtrl: ToastController) {}

  create(opts?: IMeritToastConfig): Toast {
    return this.toastCtrl.create({
      ...DefaultToastConfig,
      ...(opts || {}),
    } as ToastOptions);
  }

  createSticky(opts?: IMeritToastConfig): Toast {
    opts = {
      ...(DefaultToastConfig as IMeritToastConfig),
      ...(opts || {}),
    };

    delete opts.duration;

    return this.toastCtrl.create(opts as ToastOptions);
  }

  success(message: string) {
    return this.create({
      message,
      cssClass: 'toast-success',
    }).present();
  }

  message(message: string) {
    return this.create({ message }).present();
  }

  error(message: string) {
    return this.create({
      message,
      cssClass: 'toast-error',
    }).present();
  }
}
