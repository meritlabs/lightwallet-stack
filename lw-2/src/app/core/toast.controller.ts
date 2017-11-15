import {Injectable} from "@angular/core";

import {ToastController as IonicToastController, Toast, ToastOptions} from "ionic-angular";
import {ToastConfig} from "./toast.config";

@Injectable()
export class MeritToastController {

  constructor(private toastCtrl:IonicToastController) {
  }

  create(opts?: ToastOptions): Toast {

    if (!opts) opts = {};
    if (!opts.position) opts.position  =  ToastConfig.POSITION;
    if (!opts.duration) opts.duration  =  ToastConfig.DURATION;
    if (!opts.cssClass) opts.cssClass  =  ToastConfig.CLASS_MESSAGE;

    return this.toastCtrl.create(opts);
  }

}