import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NavController, App, Platform } from 'ionic-angular';

// Services
import { ProfileService } from 'merit/core/profile.service';
import { PlatformService } from 'merit/core/platform.service';
import { ConfigService } from 'merit/shared/config.service';
import { AppService } from 'merit/core/app-settings.service';
import { BwcService } from 'merit/core/bwc.service';
import { FCM } from '@ionic-native/fcm';


import * as _ from 'lodash';
import * as Promise from 'bluebird';
import { Logger } from "merit/core/logger";
import { MeritWalletClient } from 'src/lib/merit-wallet-client';
import { PollingNotificationsService } from 'merit/core/notification/polling-notification.service';
import { Observable } from 'rxjs/Observable';


@Injectable()
export class PushNotificationsService {
  private navCtrl: NavController;
  private isIOS: boolean;
  private isAndroid: boolean;
  private usePushNotifications: boolean;
  private _token = null;
  private retriesRemaining: number = 3; // Try to get a token 3 times, and then give up.

  constructor(
    public http: HttpClient,
    public profileService: ProfileService,
    public platformService: PlatformService,
    public configService: ConfigService,
    public logger: Logger,
    public appService: AppService,
    private app: App,
    private bwcService: BwcService,
    private platform: Platform,
    private pollingNotificationService: PollingNotificationsService,
    private FCM: FCM,
  ) {
    this.logger.info('Hello PushNotificationsService Service');
    this.isIOS = this.platformService.isIOS;
    this.isAndroid = this.platformService.isAndroid;
    this.usePushNotifications = this.platformService.isCordova && !this.platformService.isWP;

    if (this.usePushNotifications) {
      
      this.platform.ready().then((readySource) => {
        this.init();
      });
    } else {
      this.logger.info("Push notifications are disabled, enabling long polling.");
      this.pollingNotificationService.enable();
    }
  }

  public isAvailable() {
    return (this.platform.is('cordova'));
  }


  public init(): void {
    if (!this.usePushNotifications || this._token) return;
    this.configService.load().then(() => {
      if (!this.configService.get().pushNotificationsEnabled) return;
     
      this.logger.info('Starting push notification registration...');
      this.getToken().then(() => {
        this.subscribeToEvents();
      });
    });
  }

  private getToken(): Promise<void> {
    return new Promise((resolve, reject) => { 
      return this.FCM.getToken().then((token: any) => {
      this.logger.info('Got token for push notifications: ' + token);
      this._token = token;
      return resolve();
    });
   });
  }

  // TODO: Chain getting the token as part of a standalone single-wallet subscription.
  public subscribeToEvents(): void {

    if (!this.isAvailable()) {
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
      this.navCtrl = this.app.getActiveNav();
      this.logger.info('New Event Push onNotification: ' + JSON.stringify(data));
      if (data.wasTapped) {
        // Notification was received on device tray and tapped by the user.
        let walletIdHashed = data.walletId;
        if (!walletIdHashed) return;
        this.navCtrl.setRoot('TransactView');
        this.navCtrl.popToRoot();
        this._openWallet(walletIdHashed);
      } else {
        // Notification was received in foreground. Let's propogate the event
        // (using Ionic Events) to the relevant view.
        if (data.walletId) {
          let wallet: MeritWalletClient = this.profileService.getWallet(data.walletId);
          if (!_.isEmpty(wallet)) {
            // Let's re-shape the event to match the notificatons stored in BWS
            let shapedEvent = {
              data: _.pick(data, ['amount', 'address', 'txid']),
              type: data.type,
              walletId: data.walletId
            }
            this.profileService.propogateBwsEvent(shapedEvent, wallet);
          }
        }
      }
    });
  }

  public updateSubscription(walletClient: MeritWalletClient): void {
    if (!this._token) {
      this.logger.warn('Push notifications disabled for this device. Nothing to do here.');
      return;
    }
    if (!this.isAvailable()) {
      this.logger.warn('Push notification service inactive: cordova not available');
      return;
    }
    this.subscribe(walletClient);
  }

  public enable(): void {
    if (!this._token) {
      this.logger.warn('No token available for this device. Cannot set push notifications. Needs registration.');
      return;
    }

    this.profileService.getWallets().then((wallets) => {
      this.logger.warn("Got Wallets: ", wallets);
      _.forEach(wallets, (walletClient: MeritWalletClient) => {
        this.logger.warn("Subscribing to push with: ", walletClient);
        this.subscribe(walletClient);
        // We should be handling real-time updates to the application through either data push or
        // through long-polling, but not both.  
        this.pollingNotificationService.disablePolling(walletClient);
      });
    });

  };

  public disable(): void {

    if (!this.isAvailable()) {
      this.logger.warn('Push notification service inactive: cordova not available');
      return;
    }

    if (!this._token) {
      this.logger.warn('No token available for this device. Cannot disable push notifications.');
      return;
    }

    this.profileService.getWallets().then((wallets) => {
      _.forEach(wallets, (walletClient: MeritWalletClient) => {
        this._unsubscribe(walletClient);
        // We should be handling real-time updates to the application through either data push or
        // through long-polling, but not both.  
        this.pollingNotificationService.enablePolling(walletClient);
      });
    })
    this._token = null;
  }

  public unsubscribe(walletClient: MeritWalletClient): Promise<void> {
    if (!this.isAvailable()) {
      this.logger.warn('Push notification service inactive: cordova not available');
      return Promise.resolve();
    }

    if (!this._token) return;
    return this._unsubscribe(walletClient);
  }

  public subscribe(walletClient: MeritWalletClient): Promise<void> {

    if (!this.isAvailable()) {
      this.logger.warn('Push notification service inactive: cordova not available');
      return;
    }

    if (!this.configService.get().pushNotificationsEnabled) {
      this.logger.warn("Attempting to subscribe to push notification when disabled in config.  Skipping...");
      return;
    }
    if (!this._token && this.retriesRemaining > 0) {
      this.retriesRemaining--;
      this.logger.warn(`Attempted to subscribe without an available token; attempting to acquire. ${this.retriesRemaining} attempts remaining.`);
      return this.getToken().then(()=>{
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
      this.logger.info("Subscribed to push notifications successfully for: ", walletClient.name);
    }).catch((err) => {
      if (err) {
        this.logger.error(walletClient.name + ': Subscription Push Notifications error. ', JSON.stringify(err));
      } else {
        this.logger.info(walletClient.name + ': Subscription Push Notifications success.');
      }
    });
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

  private _openWallet(walletIdHashed: any): Promise<void> {
    return this.profileService.getWallets().then((wallets) => {
      let wallet: MeritWalletClient = _.find(wallets, (w: any) => {
        let walletIdHash = this.bwcService.getSJCL().hash.sha256.hash(parseInt(w.credentials.walletId));
        return _.isEqual(walletIdHashed, this.bwcService.getSJCL().codec.hex.fromBits(walletIdHash));
      });

      if (!wallet) return;

      if (!wallet.isComplete()) {
        this.navCtrl.push('CopayersView', { walletId: wallet.credentials.walletId });
        return;
      }
      this.navCtrl.push('WalletDetailsViews', { walletId: wallet.credentials.walletId });
    });
  }
}
