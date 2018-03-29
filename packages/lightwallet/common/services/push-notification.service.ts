import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoggerService } from '@merit/common/services/logger.service';
import { MeritWalletClient } from '@merit/common/merit-wallet-client';

@Injectable()
export class PushNotificationsService {
  protected token;

  protected get pushNotificationsEnabled(): boolean {
    return false;
  }

  protected get hasPermission(): boolean {
    return false;
  }

  // TODO: Chain getting the token as part of a standalone single-wallet subscription.
  public async subscribeToEvents() {
    if (!this.usePushNotifications) {
      this.logger.warn('Push notification service inactive: cordova not available');
      return;
    }

    this.FCM.onTokenRefresh().subscribe((token: any) => {
      if (!this._token) return;
      this.logger.info('Refresh and update token for push notifications...');
      this._token = token;
      this.enable();
    });
    //this.pushObj = this.push.init(this.pushOptions);

    this.FCM.onNotification().subscribe((data: any) => {
      if (!this._token) return;
      this.logger.info('New Event Push onNotification: ' + JSON.stringify(data));
      this.ngZone.run(async () => {
        if (data.wasTapped) {
          // Notification was received on device tray and tapped by the user.
          const wallet = (await this.profileService.getWallets()).find(w => w.id == data.walletId);
          if (!wallet) return;
          return this.app.getActiveNav().push('WalletDetailsView', {
            wallet: await createDisplayWallet(wallet, this.walletService, this.addressService, this.txFormatService, {
              skipAnv: true,
              skipRewards: true,
              skipAlias: true
            })
          });
        } else {
          // Notification was received in foreground. Let's propogate the event
          // (using Ionic Events) to the relevant view.
          if (data.walletId) {
            const wallet = (await this.profileService.getWallets()).find(w => w.id == data.walletId);
            if (!_.isEmpty(wallet)) {
              // Let's re-shape the event to match the notificatons stored in BWS
              this.profileService.propogateBwsEvent({
                data: _.pick(data, ['amount', 'address', 'txid']),
                type: data.type,
                walletId: data.walletId
              }, wallet);
            }
          }
        }
      });
    });
  }

  public updateSubscription(walletClient: MeritWalletClient): void {
    if (!this._token) {
      this.logger.warn('Push notifications disabled for this device. Nothing to do here.');
      return;
    }
    if (!this.usePushNotifications) {
      this.logger.warn('Push notification service inactive: cordova not available');
      return;
    }
    this.subscribe(walletClient);
  }

  public async enable(): Promise<any> {
    if (!this._token) {
      this.logger.warn('No token available for this device. Cannot set push notifications. Needs registration.');
      return;
    }

    // We should be handling real-time updates to the application through either data push or
    // through long-polling, but not both.
    (await this.profileService.getWallets()).forEach(w => {
      this.subscribe(w);
      // TODO(ibby): this.pollingNotificationService.disablePolling(w);
    });

  };

  public async disable(): Promise<any> {
    if (!this.usePushNotifications) {
      this.logger.warn('Push notification service inactive: cordova not available');
      return;
    }

    if (!this._token) {
      this.logger.warn('No token available for this device. Cannot disable push notifications.');
      return;
    }

    // We should be handling real-time updates to the application through either data push or
    // through long-polling, but not both.
    (await this.profileService.getWallets()).forEach(w => {
      this._unsubscribe(w);
    // TODO(ibby):this.pollingNotificationService.enablePolling(w);

    });
    this.token = void 0;
  }

  async subscribe(walletClient: MeritWalletClient) {
    console.log('Subscribing to push notifications of wallet ', walletClient, this.pushNotificationsEnabled, this.token);
    if (this.pushNotificationsEnabled && this.token) {
      try {
        await walletClient.pushNotificationsSubscribe({ token: this.token })
      } catch(err) {
        if (err) {
          this.logger.error(walletClient.name + ': Subscription Push Notifications error. ', JSON.stringify(err));
        } else {
          this.logger.info(walletClient.name + ': Subscription Push Notifications success.');
        }
      }
    }
  }

  async unsubscribe(walletClient: MeritWalletClient) {
    try {
      await walletClient.pushNotificationsUnsubscribe(this.token)
    } catch(err) {
      if (err) {
        this.logger.error(walletClient.name + ': Subscription Push Notifications error. ', JSON.stringify(err));
      } else {
        this.logger.info(walletClient.name + ': Subscription Push Notifications success.');
      }
    }
  }
}
