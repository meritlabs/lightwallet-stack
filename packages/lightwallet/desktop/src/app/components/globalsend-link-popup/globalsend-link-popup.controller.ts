import { Injectable } from '@angular/core';
import { DOMController } from '@merit/desktop/app/components/dom.controller';
import { GlobalsendLinkPopupComponent } from '@merit/desktop/app/components/globalsend-link-popup/globalsend-link-popup.component';

@Injectable()
export class GlobalsendLinkPopupController {
  constructor(private domCtrl: DOMController) {}

  create(globalSendURL: string) {
    this.domCtrl.create(GlobalsendLinkPopupComponent, globalSendURL);
  }
}
