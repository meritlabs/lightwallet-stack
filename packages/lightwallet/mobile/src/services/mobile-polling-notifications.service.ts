import { Injectable } from '@angular/core';
import { ConfigService, IAppConfig } from '@merit/common/services/config.service';
import { LoggerService } from '@merit/common/services/logger.service';
import { PollingNotificationsService } from '@merit/common/services/polling-notification.service';
import { ProfileService } from '@merit/common/services/profile.service';
import { pick } from 'lodash';

@Injectable()
export class MobilePollingNotificationsService extends PollingNotificationsService {
  constructor(profileService: ProfileService, logger: LoggerService, private configService: ConfigService) {
    super(profileService, logger, null, null);
  }

  protected async pushNotificationsEnabled(): Promise<boolean> {
    const config: IAppConfig = await this.configService.load();
    return config && config.pushNotificationsEnabled;
  }

  protected onFetch(notifications: any[]) {
    notifications.forEach(async (notification: any) => {
      if (notification && notification.walletId) {
        const wallet = (await this.profileService.getWallets()).find(w => w.id == notification.walletId);

        if (wallet) {
          this.profileService.propogateBwsEvent(
            {
              data: pick(notification, 'amount', 'address', 'txid'),
              type: notification.type,
              walletId: notification.walletId,
            },
            wallet,
          );
        }
      }
    });
  }
}
