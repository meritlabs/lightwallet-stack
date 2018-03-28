import { Injectable } from '@angular/core';
import { App, NavController, Platform } from 'ionic-angular';
import * as _ from 'lodash';
import { ProfileService } from '@merit/common/services/profile.service';
import { ConfigService } from '@merit/common/services/config.service';
import { PlatformService } from '@merit/common/services/platform.service';
import { LoggerService } from '@merit/common/services/logger.service';
import { AppSettingsService } from '@merit/common/services/app-settings.service';
import { MeritWalletClient } from '@merit/common/merit-wallet-client';

@Injectable()
export class PollingNotificationsService {
  private navCtrl: NavController;
  private isIOS: boolean;
  private isAndroid: boolean;
  private usePollingNotifications: boolean;

  constructor(public profileService: ProfileService,
              public platformService: PlatformService,
              public configService: ConfigService,
              public logger: LoggerService,
              public appService: AppSettingsService,
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

  public async enable(): Promise<any> {
    if (!this.usePollingNotifications) {
      this.logger.warn('Attempted to enable polling, even though it is currently disabled in app settings.');
      return;
    }

    (await this.profileService.getWallets()).forEach(w => this.enablePolling(w));

  };

  public async disable(): Promise<any> {
    if (this.usePollingNotifications) {
      this.logger.warn('Attempted to disable polling while it is enabled in app settings.');
      return;
    }

    (await this.profileService.getWallets()).forEach(w => this.disablePolling(w));
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
