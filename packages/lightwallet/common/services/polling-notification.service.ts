import { Injectable, Optional } from '@angular/core';
import { MeritWalletClient } from '@merit/common/merit-wallet-client';
import { IRootAppState } from '@merit/common/reducers';
import { AddNotificationAction } from '@merit/common/reducers/notifications.reducer';
import { RefreshOneWalletAction, selectWallets } from '@merit/common/reducers/wallets.reducer';
import { LoggerService } from '@merit/common/services/logger.service';
import { PersistenceService2 } from '@merit/common/services/persistence2.service';
import { ProfileService } from '@merit/common/services/profile.service';
import { Store } from '@ngrx/store';
import { uniqBy } from 'lodash';
import { debounceTime, filter, map } from 'rxjs/operators';
import { Subscription } from 'rxjs/Subscription';
import { ElectronService } from '../../desktop/src/services/electron.service';
import { DisplayWallet, IDisplayWalletOptions } from '@merit/common/models/display-wallet';
import { RefreshOneWalletTransactions } from '@merit/common/reducers/transactions.reducer';
import { getLatestValue } from '@merit/common/utils/observables';

@Injectable()
export class PollingNotificationsService {
  private pollingNotificationsSubscriptions: { [walletId: string]: Subscription } = {};

  constructor(protected logger: LoggerService,
              private store: Store<IRootAppState>,
              @Optional() private persistenceService: PersistenceService2) {
    this.logger.info('Hello PollingNotification Service');
  }

  async enable(): Promise<any> {
    if (await this.pushNotificationsEnabled()) {
      this.logger.warn('Attempted to enable polling, even though it is currently disabled in app settings.');
      return;
    }

    const wallets = await getLatestValue(this.store.select(selectWallets), wallets => wallets && wallets.length > 0);
    wallets.forEach((w: DisplayWallet) => this.enablePolling(w.client));
  };

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
      this.pollingNotificationsSubscriptions[walletClient.id] = walletClient.initNotifications()
        .pipe(
          filter((notifications: any[]) => notifications && !!notifications.length),
          debounceTime(500)
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
    notifications.forEach((notification) => {
      if (notification) {
        notification = {
          ...notification,
          ...notification.data,
          read: false
        };

        delete notification.data;

        this.store.dispatch(new AddNotificationAction(notification));

        if (notification.walletId) {
          if (notification.type === 'incoming_invite_request') {
            this.store.dispatch(new RefreshOneWalletAction(notification.walletId, {
              skipAlias: true,
              skipANV: true,
              skipRankInfo: true,
            }));
          } else {
            this.store.dispatch(new RefreshOneWalletTransactions(notification.walletId));
          }
        }
      }
    });
  }
}
