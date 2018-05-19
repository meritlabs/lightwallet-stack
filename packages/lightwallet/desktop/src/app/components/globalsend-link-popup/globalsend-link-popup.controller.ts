import { Injectable } from '@angular/core';
import { DOMController } from '../dom.controller';
import { GlobalsendLinkPopupComponent } from './meritmoney-link-popup.component';

@Injectable()
export class GlobalsendLinkPopupController {
  constructor(private domCtrl: DOMController) {}

  create(globalSendURL: string) {
    this.domCtrl.create(GlobalsendLinkPopupComponent, globalSendURL);
  }
}
