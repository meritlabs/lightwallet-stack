import { Injectable } from '@angular/core';
import { LoadingControllerService } from '@merit/common/services/loading-controller.service';
import { LoadingController } from 'ionic-angular';

@Injectable()
export class MobileLoadingControllerService extends LoadingControllerService {
  private loader;

  constructor(private loadingCtrl: LoadingController) {
    super();
  }

  show(message?: string) {
    if (this.loader) {
      this.loader.dismissAll();
      this.loader = void 0;
    }

    this.loader = this.loadingCtrl.create({ content: message });
    this.loader.present();
  }

  hide() {
    if (this.loader) {
      this.loader.dismissAll();
    }
  }
}
