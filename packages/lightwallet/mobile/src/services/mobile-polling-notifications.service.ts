import { Injectable } from '@angular/core';
import { ConfigService, IAppConfig } from '@merit/common/services/config.service';
import { LoggerService } from '@merit/common/services/logger.service';
import { PollingNotificationsService } from '@merit/common/services/polling-notification.service';
import { ProfileService } from '@merit/common/services/profile.service';
import { Events } from 'ionic-angular';

@Injectable()
export class MobilePollingNotificationsService extends PollingNotificationsService {
  constructor(profileService: ProfileService,
              logger: LoggerService,
              private configService: ConfigService,
              private events: Events) {
    super(profileService, logger, null, null);
  }

  protected async pushNotificationsEnabled(): Promise<boolean> {
    const config: IAppConfig = await this.configService.load();
    return config && config.pushNotificationsEnabled;
  }

  protected onFetch(notifications: any[]) {
    notifications.forEach((notification: any) => {
      if (notification && notification.walletId) {
        this.events.publish('UpdateWallet', {
          walletId: notification.walletId
        });
      }
    });
  }
}
