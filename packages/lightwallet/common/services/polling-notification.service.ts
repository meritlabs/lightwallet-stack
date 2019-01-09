import { Injectable, Optional } from '@angular/core';
import { MeritWalletClient } from '@merit/common/merit-wallet-client';
import { IRootAppState } from '@merit/common/reducers';
import { AddNotificationAction } from '@merit/common/reducers/notifications.reducer';
import { RefreshOneWalletAction } from '@merit/common/reducers/wallets.reducer';
import { LoggerService } from '@merit/common/services/logger.service';
import { PersistenceService2 } from '@merit/common/services/persistence2.service';
import { ProfileService } from '@merit/common/services/profile.service';
import { Store } from '@ngrx/store';
import { uniqBy } from 'lodash';
import { debounceTime, filter, map } from 'rxjs/operators';
import { Subscription } from 'rxjs/Subscription';
import { ElectronService } from '../../desktop/src/services/electron.service';

@Injectable()
export class PollingNotificationsService {
  private pollingNotificationsSubscriptions: { [walletId: string]: Subscription } = {};

  constructor(
    protected profileService: ProfileService,
    protected logger: LoggerService,
    @Optional() private store: Store<IRootAppState>,
    @Optional() private persistenceService: PersistenceService2,
  ) {
    this.logger.info('Hello PollingNotification Service');
  }

  async enable(): Promise<any> {
    if (await this.pushNotificationsEnabled()) {
      this.logger.warn('Attempted to enable polling, even though it is currently disabled in app settings.');
      return;
    }

    (await this.profileService.getWallets()).forEach(w => this.enablePolling(w));
  }

  disable() {
    let walletId: string;
    for (walletId in this.pollingNotificationsSubscriptions) {
      try {
        this.pollingNotificationsSubscriptions[walletId].unsubscribe();
        delete this.pollingNotificationsSubscriptions[walletId];
      } catch (e) {}
    }
  }

  enablePolling(walletClient: MeritWalletClient): void {
    if (this.pollingNotificationsSubscriptions[walletClient.id]) {
      this.logger.warn('Attempting to enable polling for wallet that already has polling enabled: ', walletClient.id);
    } else {
      this.pollingNotificationsSubscriptions[walletClient.id] = walletClient
        .initNotifications()
        .pipe(
          filter((notifications: any[]) => !!notifications),
          map((notifications: any[]) => uniqBy(notifications, 'walletId')),
          debounceTime(500),
        )
        .subscribe(this.onFetch.bind(this));
    }
  }

  protected async pushNotificationsEnabled(): Promise<boolean> {
    if (ElectronService.isElectronAvailable) return false;

    const pnSettings = await this.persistenceService.getNotificationSettings();
    return Boolean(pnSettings && pnSettings.pushNotifications);
  }

  protected onFetch(notifications: any[]) {
    notifications.forEach(notification => {
      if (notification) {
        notification = {
          ...notification,
          ...notification.data,
          read: false,
        };

        delete notification.data;

        this.store.dispatch(new AddNotificationAction(notification));

        if (notification.walletId) {
          this.store.dispatch(
            new RefreshOneWalletAction(notification.walletId, {
              skipAlias: true,
              skipShareCode: true,
            }),
          );
        }
      }
    });
  }
}
