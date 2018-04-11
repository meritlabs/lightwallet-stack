import { Injectable } from '@angular/core';
import { MeritWalletClient } from '@merit/common/merit-wallet-client';
import { IRootAppState } from '@merit/common/reducers';
import { RefreshOneWalletAction } from '@merit/common/reducers/wallets.reducer';
import { ConfigService } from '@merit/common/services/config.service';
import { LoggerService } from '@merit/common/services/logger.service';
import { PersistenceService2 } from '@merit/common/services/persistence2.service';
import { ProfileService } from '@merit/common/services/profile.service';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';

@Injectable()
export class PollingNotificationsService {
  private pollingNotificationsSubscriptions: Subscription[] = [];

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
    this.pollingNotificationsSubscriptions.forEach((sub: Subscription) => {
      try {
        sub.unsubscribe();
      } catch (e) {}
    });
  }

  enablePolling(walletClient: MeritWalletClient): void {
    this.pollingNotificationsSubscriptions.push(
      walletClient.initNotifications()
        .subscribe((notifications: any[]) => {
          notifications.forEach((notification) => {
            if (notification && notification.walletId) {
              this.store.dispatch(new RefreshOneWalletAction(notification.walletId, {
                skipAlias: true,
                skipShareCode: true
              }));
            }
          });
        })
    );
  }
}
