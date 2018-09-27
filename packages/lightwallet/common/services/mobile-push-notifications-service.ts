import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { FCM } from '@ionic-native/fcm';
import { MeritWalletClient } from '@merit/common/merit-wallet-client';
import { AppSettingsService } from '@merit/common/services/app-settings.service';
import { ConfigService } from '@merit/common/services/config.service';
import { LoggerService } from '@merit/common/services/logger.service';
import { MWCService } from '@merit/common/services/mwc.service';
import { PlatformService } from '@merit/common/services/platform.service';
import { PollingNotificationsService } from '@merit/common/services/polling-notification.service';
import { ProfileService } from '@merit/common/services/profile.service';
import { PushNotificationsService } from '@merit/common/services/push-notification.service';
import { App, Platform } from 'ionic-angular';
import * as _ from 'lodash';

@Injectable()
export class MobilePushNotificationsService extends PushNotificationsService {
  private isIOS: boolean;
  private isAndroid: boolean;
  private usePushNotifications: boolean;
  private retriesRemaining: number = 3; // Try to get a token 3 times, and then give up.

  protected get pushNotificationsEnabled(): boolean {
    return this.configService.get().pushNotificationsEnabled;
  }

  constructor(http: HttpClient,
              public profileService: ProfileService,
              public platformService: PlatformService,
              public configService: ConfigService,
              logger: LoggerService,
              public appService: AppSettingsService,
              private app: App,
              private mwcService: MWCService,
              platform: Platform,
              private FCM: FCM,
              private ngZone: NgZone,
              private pollingNotifications: PollingNotificationsService) {
    super(http, logger);
    this.logger.info('Hello PushNotificationsService Service');
    this.isIOS = this.platformService.isIOS;
    this.isAndroid = this.platformService.isAndroid;
    this.usePushNotifications = this.platformService.isCordova && !this.platformService.isWP;
    this.platform = this.isIOS ? 'iOS' : 'Android';
    this.packageName = 'me.merit.wallet';

    if (this.usePushNotifications) {
      platform.ready().then(() => {
        this.init();
      });
    } else {
      this.logger.info('Push notifications are disabled, enabling long polling.');
      // TODO: enable this when we're making use of it on mobile side
      // this.pollingNotificationService.enable();
    }
  }

  protected async enablePolling() {
    const wallets = await this.getWallets();
    wallets.forEach(w => this.pollingNotifications.enablePolling(w));
  }
  protected disablePolling() {
    this.pollingNotifications.disable();
  }

  getWallets() {
    return this.profileService.getWallets();
  }

  async init() {
    if (!this.usePushNotifications) return;

    if (!this.token) {
      await this.configService.load();
      if (!this.configService.get().pushNotificationsEnabled) return;

      this.logger.info('Starting push notification registration...');

      await this.getToken();
      await this.subscribeToEvents();
    }

    this.enable();
  }

  // TODO: Chain getting the token as part of a standalone single-wallet subscription.
  public async subscribeToEvents(): Promise<any> {
    if (!this.usePushNotifications) {
      this.logger.warn('Push notification service inactive: cordova not available');
      return;
    }

    this.FCM.onTokenRefresh().subscribe((token: any) => {
      if (!this.token) return;
      this.logger.info('Refresh and update token for push notifications...');
      this.token = token;
      this.enable();
    });
    //this.pushObj = this.push.init(this.pushOptions);

    this.FCM.onNotification().subscribe((data: any) => {
      if (!this.token) return;
      this.logger.info('New Event Push onNotification: ' + JSON.stringify(data));
      this.ngZone.run(async () => {
        if (data.wasTapped) {
          // Notification was received on device tray and tapped by the user.
          const wallet = (await this.profileService.getWallets()).find(w => w.id == data.walletId);
          if (!wallet) return;
          return this.app.getActiveNav().push('WalletDetailsView', { wallet });
        } else {
          // Notification was received in foreground. Let's propogate the event
          // (using Ionic Events) to the relevant view.
          if (data.walletId) {
            const wallet = (await this.profileService.getWallets()).find(w => w.id == data.walletId);
            if (!_.isEmpty(wallet)) {
              // Let's re-shape the event to match the notificatons stored in MWS
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

  updateSubscription(walletClient: MeritWalletClient): void {
    if (!this.token) {
      this.logger.warn('Push notifications disabled for this device. Nothing to do here.');
      return;
    }
    if (!this.usePushNotifications) {
      this.logger.warn('Push notification service inactive: cordova not available');
      return;
    }
    this.subscribe(walletClient);
  }


  enable() {
    if (!this.token) {
      this.logger.warn('No token available for this device. Cannot set push notifications. Needs registration.');
      return;
    }
    return super.enable();
  };

  async disable() {
    if (!this.usePushNotifications) {
      this.logger.warn('Push notification service inactive: cordova not available');
      return;
    }

    if (!this.token) {
      this.logger.warn('No token available for this device. Cannot disable push notifications.');
      return;
    }

    return super.disable();
  }

  unsubscribe(walletClient: MeritWalletClient): Promise<void> {
    if (!this.usePushNotifications) {
      this.logger.warn('Push notification service inactive: cordova not available');
      return Promise.resolve();
    }

    if (!this.token) return;
    return super.unsubscribe(walletClient);
  }

  async subscribe(walletClient: MeritWalletClient) {
    if (!this.usePushNotifications) {
      this.logger.warn('Push notification service inactive: cordova not available');
      return;
    }

    if (!this.configService.get().pushNotificationsEnabled) {
      this.logger.warn('Attempting to subscribe to push notification when disabled in config.  Skipping...');
      return;
    }
    if (!this.token && this.retriesRemaining > 0) {
      this.retriesRemaining--;
      this.logger.warn(`Attempted to subscribe without an available token; attempting to acquire. ${this.retriesRemaining} attempts remaining.`);
      await this.getToken();
      return super.subscribe(walletClient);
    }
    return super.subscribe(walletClient);
  }

  protected async getToken() {
    this.token = await this.FCM.getToken();
    this.logger.info('Got token for push notifications: ' + this.token);
    return this.token;
  }
}
