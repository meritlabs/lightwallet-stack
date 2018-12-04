import { Injectable } from '@angular/core';
import {
  ConfirmDialogComponent,
  IConfirmDialogButton,
} from '@merit/desktop/app/components/confirm-dialog/confirm-dialog.component';
import { DOMController } from '@merit/desktop/app/components/dom.controller';

@Injectable()
export class ConfirmDialogControllerService {
  constructor(private domCtrl: DOMController) {}

  create(title: string, message: string, buttons: IConfirmDialogButton[]) {
    return this.domCtrl.create(ConfirmDialogComponent, { title, message, buttons });
  }
}
