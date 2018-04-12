import { Injectable } from '@angular/core';
import { MeritWalletClient } from '@merit/common/merit-wallet-client';
import { IRootAppState } from '@merit/common/reducers';
import { RefreshOneWalletAction } from '@merit/common/reducers/wallets.reducer';
import { ConfigService } from '@merit/common/services/config.service';
import { LoggerService } from '@merit/common/services/logger.service';
import { PersistenceService2 } from '@merit/common/services/persistence2.service';
import { ProfileService } from '@merit/common/services/profile.service';
import { Store } from '@ngrx/store';
import { debounceTime, filter, map } from 'rxjs/operators';
import { Subscription } from 'rxjs/Subscription';
import { uniqBy } from 'lodash';

@Injectable()
export class PollingNotificationsService {
  private pollingNotificationsSubscriptions: { [walletId: string]: Subscription } = {};

  constructor(private profileService: ProfileService,
              private configService: ConfigService,
              private logger: LoggerService,
              private store: Store<IRootAppState>,
              private persistenceService: PersistenceService2) {
    this.logger.info('Hello PollingNotification Service');
  }

  async enable(): Promise<any> {
    const pnSettings = await this.persistenceService.getNotificationSettings();
    if (pnSettings && pnSettings.pushNotifications) {
      this.logger.warn('Attempted to enable polling, even though it is currently disabled in app settings.');
      return;
    }

    (await this.profileService.getWallets()).forEach(w => this.enablePolling(w));
  };

  disable() {
    let walletId: string;
    for (walletId in this.pollingNotificationsSubscriptions) {
      try {
        this.pollingNotificationsSubscriptions[walletId].unsubscribe();
      } catch (e) {}
    }
  }

  enablePolling(walletClient: MeritWalletClient): void {
    if (this.pollingNotificationsSubscriptions[walletClient.id]) {
      this.logger.warn('Attempting to enable polling for wallet that already has polling enabled: ', walletClient.id);
    } else {
      this.pollingNotificationsSubscriptions[walletClient.id] = walletClient.initNotifications()
        .pipe(
          map((notifications: any[]) => uniqBy(notifications, 'walletId')),
          debounceTime(500)
        )
        .subscribe((notifications: any[]) => {
          notifications.forEach((notification) => {
            if (notification && notification.walletId) {
              this.store.dispatch(new RefreshOneWalletAction(notification.walletId, {
                skipAlias: true,
                skipShareCode: true
              }));
            }
          });
        });
    }
  }
}
