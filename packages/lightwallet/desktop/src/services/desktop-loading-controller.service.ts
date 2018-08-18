import { Injectable } from '@angular/core';
import { LoadingControllerService } from '@merit/common/services/loading-controller.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Injectable()
export class DesktopLoadingControllerService extends LoadingControllerService {
  constructor(private loader: Ng4LoadingSpinnerService) {
    super();
  }

  show() {
    this.loader.show();
  }

  hide() {
    this.loader.hide();
  }
}
