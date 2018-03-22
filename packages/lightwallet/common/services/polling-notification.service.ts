import { Injectable } from '@angular/core';
import { ProfileService } from '@merit/common/services/profile.service';
import { ConfigService } from '@merit/common/services/config.service';
import { PlatformService } from '@merit/common/services/platform.service';
import { LoggerService } from '@merit/common/services/logger.service';
import { MeritWalletClient } from '@merit/common/merit-wallet-client';

@Injectable()
export class PollingNotificationsService {
  private usePollingNotifications: boolean;

  constructor(private profileService: ProfileService,
              private platformService: PlatformService,
              private configService: ConfigService,
              private logger: LoggerService) {
    this.logger.info('Hello PollingNotification Service');
    this.usePollingNotifications = !this.configService.get().pushNotificationsEnabled;

    this.platformService.ready().then(() => {
      if (this.usePollingNotifications) {
        this.enable();
      } else {
        this.disable();
      }
    });
  }

  async enable() {
    if (!this.usePollingNotifications) {
      this.logger.warn('Attempted to enable polling, even though it is currently disabled in app settings.');
      return;
    }

    const wallets = await this.profileService.getWallets();
    wallets.forEach(this.enablePolling.bind(this));
  }

  async disable() {
    if (this.usePollingNotifications) {
      this.logger.warn('Attempted to disable polling while it is enabled in app settings.');
      return;
    }

    const wallets = await this.profileService.getWallets();
    wallets.forEach(this.disablePolling.bind(this));
  }


  enablePolling(walletClient: MeritWalletClient): void {
    walletClient._initNotifications().catch((err) => {
      if (err) {
        this.logger.error(walletClient.name + ': Long Polling Notifications error. ', JSON.stringify(err));
      } else {
        this.logger.info(walletClient.name + ': Long Polling Notifications success.');
      }
    });
  }

  disablePolling(walletClient: MeritWalletClient): void {
    walletClient._disposeNotifications();
  }
}
