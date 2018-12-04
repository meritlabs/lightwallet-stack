import { Component, OnDestroy } from '@angular/core';
import { IMeritToastConfig } from '@merit/common/services/toast-controller.service';
import { IDynamicComponent } from '@merit/desktop/app/components/dom.controller';

@Component({
  selector: 'toast-notification',
  templateUrl: './toast-notification.component.html',
  styleUrls: ['./toast-notification.component.sass'],
  host: {
    '[class]': 'config.cssClass',
    '[hidden]': '!show',
  },
})
export class ToastNotificationComponent implements IDynamicComponent, OnDestroy {
  config: IMeritToastConfig;
  show: boolean;

  _onDismiss;

  destroy: Function;
  private timeout: any;

  ngOnDestroy() {
    this.timeout = void 0;
  }

  init(config: IMeritToastConfig) {
    config.duration = config.duration || 3000;
    this.config = config;
    this.show = true;

    this.timeout = setTimeout(() => {
      this.dismiss();
    }, config.duration);
  }

  dismiss(dismissedByUser?: boolean) {
    if (dismissedByUser && typeof this._onDismiss === 'function') this._onDismiss();

    this.show = false;
    this.destroy && this.destroy();
  }

  onDidDismiss(callback: Function) {
    this._onDismiss = callback;
  }
}
