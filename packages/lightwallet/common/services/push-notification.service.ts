import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone, Optional } from '@angular/core';
import { FCM } from '@ionic-native/fcm';
import { App, Platform } from 'ionic-angular';
import * as _ from 'lodash';
import { ProfileService } from '@merit/common/services/profile.service';
import { PlatformService } from '@merit/common/services/platform.service';
import { ConfigService } from '@merit/common/services/config.service';
import { LoggerService } from '@merit/common/services/logger.service';
import { AppSettingsService } from '@merit/common/services/app-settings.service';
import { MWCService } from '@merit/common/services/mwc.service';
import { WalletService } from '@merit/common/services/wallet.service';
import { createDisplayWallet } from '@merit/common/models/display-wallet';
import { MeritWalletClient } from '@merit/common/merit-wallet-client';
import { PollingNotificationsService } from '@merit/common/services/polling-notification.service';
import { TxFormatService } from '@merit/common/services/tx-format.service';
import { AddressService } from '@merit/common/services/address.service';


@Injectable()
export class PushNotificationsService {
  private isIOS: boolean;
  private isAndroid: boolean;
  private usePushNotifications: boolean;
  private _token = null;
  private retriesRemaining: number = 3; // Try to get a token 3 times, and then give up.

  constructor(public http: HttpClient,
              public profileService: ProfileService,
              public platformService: PlatformService,
              public configService: ConfigService,
              public logger: LoggerService,
              public appService: AppSettingsService,
              private app: App,
              private mwcService: MWCService,
              private platform: Platform,
              @Optional() private pollingNotificationService: PollingNotificationsService,
              private FCM: FCM,
              private ngZone: NgZone,
              private walletService: WalletService,
              private txFormatService: TxFormatService,
              private addressService: AddressService) {
    this.logger.info('Hello PushNotificationsService Service');
    this.isIOS = this.platformService.isIOS;
    this.isAndroid = this.platformService.isAndroid;
    this.usePushNotifications = this.platformService.isCordova && !this.platformService.isWP;

    if (this.usePushNotifications) {
      this.platform.ready().then((readySource) => {
        this.init();
      });
    } else {
      this.logger.info('Push notifications are disabled, enabling long polling.');
      this.pollingNotificationService.enable();
    }
  }


  async init() {
    if (!this.usePushNotifications || this._token) return;
    await this.configService.load();
    if (!this.configService.get().pushNotificationsEnabled) return;

    this.logger.info('Starting push notification registration...');
    await this.getToken();
    this.subscribeToEvents();
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
      this.pollingNotificationService.disablePolling(w);
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
      this.pollingNotificationService.enablePolling(w);
    });

    this._token = null;
  }

  public unsubscribe(walletClient: MeritWalletClient): Promise<void> {
    if (!this.usePushNotifications) {
      this.logger.warn('Push notification service inactive: cordova not available');
      return Promise.resolve();
    }

    if (!this._token) return;
    return this._unsubscribe(walletClient);
  }

  public subscribe(walletClient: MeritWalletClient): Promise<void> {

    if (!this.usePushNotifications) {
      this.logger.warn('Push notification service inactive: cordova not available');
      return;
    }

    if (!this.configService.get().pushNotificationsEnabled) {
      this.logger.warn('Attempting to subscribe to push notification when disabled in config.  Skipping...');
      return;
    }
    if (!this._token && this.retriesRemaining > 0) {
      this.retriesRemaining--;
      this.logger.warn(`Attempted to subscribe without an available token; attempting to acquire. ${this.retriesRemaining} attempts remaining.`);
      return this.getToken().then(() => {
        return this.subscribe(walletClient);
      });
    }
    let opts = {
      token: this._token,
      platform: this.isIOS ? 'ios' : this.isAndroid ? 'android' : null,
      packageName: this.appService.info.packageNameId
    };
    this.logger.info('Subscribing to push notifications for: ', walletClient.name);
    return walletClient.pushNotificationsSubscribe(opts).then(() => {
      this.logger.info('Subscribed to push notifications successfully for: ', walletClient.name);
    }).catch((err) => {
      if (err) {
        this.logger.error(walletClient.name + ': Subscription Push Notifications error. ', JSON.stringify(err));
      } else {
        this.logger.info(walletClient.name + ': Subscription Push Notifications success.');
      }
    });
  }

  private async getToken(): Promise<void> {
    this._token = await this.FCM.getToken();
    this.logger.info('Got token for push notifications: ' + this._token);
  }

  private _unsubscribe(walletClient: MeritWalletClient): Promise<void> {
    return walletClient.pushNotificationsUnsubscribe(this._token).catch((err: any) => {
      if (err) {
        this.logger.error(walletClient.name + ': Unsubscription Push Notifications error. ', JSON.stringify(err));
      } else {
        this.logger.info(walletClient.name + ': Unsubscription Push Notifications Success.');
      }
    });
  }
}
