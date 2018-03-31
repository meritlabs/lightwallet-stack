import { Component } from '@angular/core';
import { IDynamicComponent } from '@merit/desktop/app/components/dom.controller';

export interface IConfirmDialogButton {
  text: string;
  value: any;
  class?: string;
}

export interface IConfirmDialogOptions {
  title: string;
  message: string;
  buttons: IConfirmDialogButton[];
}

@Component({
  selector: 'confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.sass']
})
export class ConfirmDialogComponent implements IDynamicComponent {
  buttons: any[];
  title: string;
  message: string;
  destroy: Function;

  private _onDismiss: Function;

  init(config: IConfirmDialogOptions) {
    this.title = config.title;
    this.message = config.message;
    this.buttons = config.buttons;
  }

  onDismiss(callback: (value: any) => any) {
    this._onDismiss = callback;
  }

  dismiss(val: any) {
    if (typeof this._onDismiss === 'function') {
      this._onDismiss(val);
    }

    this.destroy();
  }
}
