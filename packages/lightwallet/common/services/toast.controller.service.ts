import { Injectable } from '@angular/core';
import { ToastController } from 'ionic-angular/components/toast/toast-controller';
import { ToastOptions } from 'ionic-angular/components/toast/toast-options';
import { Toast } from 'ionic-angular/components/toast/toast';

export class ToastConfig {
  static DURATION = 3000;
  static POSITION = 'top';
  static CLASS_ERROR = 'toast-error';
  static CLASS_MESSAGE = 'toast-message';
  static CLASS_SUCCESS = 'toast-success';
}

@Injectable()
export class MeritToastController {
  constructor(private toastCtrl: ToastController) {
  }

  create(opts?: ToastOptions): Toast {
    if (!opts) opts = {};
    if (!opts.position) opts.position = ToastConfig.POSITION;
    if (!opts.duration) opts.duration = ToastConfig.DURATION;
    if (!opts.cssClass) opts.cssClass = ToastConfig.CLASS_MESSAGE;

    return this.toastCtrl.create(opts);
  }

  createSticky(opts?: ToastOptions): Toast {
    if (!opts) opts = {};
    if (!opts.position) opts.position = ToastConfig.POSITION;
    if (!opts.cssClass) opts.cssClass = ToastConfig.CLASS_MESSAGE;
    if (!opts.showCloseButton) opts.showCloseButton = true;

    return this.toastCtrl.create(opts);
  }
}
