import { Injectable } from '@angular/core';
import { App, NavController, Platform } from 'ionic-angular';

import * as _ from 'lodash';
import { AppService } from 'merit/core/app-settings.service';

import { Logger } from 'merit/core/logger';
import { PlatformService } from 'merit/core/platform.service';
// Services
import { ProfileService } from 'merit/core/profile.service';
import { ConfigService } from 'merit/shared/config.service';
import { MeritWalletClient } from '../../../lib/merit-wallet-client/index';

@Injectable()
export class PollingNotificationsService {
  private navCtrl: NavController;
  private isIOS: boolean;
  private isAndroid: boolean;
  private usePollingNotifications: boolean;

  constructor(public profileService: ProfileService,
              public platformService: PlatformService,
              public configService: ConfigService,
              public logger: Logger,
              public appService: AppService,
              private app: App,
              private platform: Platform) {
    this.logger.info('Hello PollingNotification Service');
    this.isIOS = this.platformService.isIOS;
    this.isAndroid = this.platformService.isAndroid;
    this.usePollingNotifications = !this.configService.get().pushNotificationsEnabled;

    this.platform.ready().then((readySource) => {
      if (this.usePollingNotifications) {
        this.enable();
      } else {
        this.disable();
      }
    });
  }

  public enable(): void {
    if (!this.usePollingNotifications) {
      this.logger.warn('Attempted to enable polling, even though it is currently disabled in app settings.');
      return;
    }

    this.profileService.getWallets().then((wallets) => {
      _.forEach(wallets, (walletClient: MeritWalletClient) => {
        this.enablePolling(walletClient);
      });
    });

  };

  public disable(): void {
    if (this.usePollingNotifications) {
      this.logger.warn('Attempted to disable polling while it is enabled in app settings.');
      return;
    }

    this.profileService.getWallets().then((wallets) => {
      _.forEach(wallets, (walletClient: MeritWalletClient) => {
        this.disablePolling(walletClient);
      });
    })
  }


  public enablePolling(walletClient: MeritWalletClient): void {
    walletClient._initNotifications().catch((err) => {
      if (err) {
        this.logger.error(walletClient.name + ': Long Polling Notifications error. ', JSON.stringify(err));
      } else {
        this.logger.info(walletClient.name + ': Long Polling Notifications success.');
      }
    });
  }

  public disablePolling(walletClient: MeritWalletClient): void {
    walletClient._disposeNotifications();
  }

}
