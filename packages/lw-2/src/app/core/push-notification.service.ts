import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NavController, App, Platform } from 'ionic-angular';
import { FCM } from '@ionic-native/fcm';

//providers
import { ProfileService } from 'merit/core/profile.service';
import { PlatformService } from 'merit/core/platform.service';
import { ConfigService } from 'merit/shared/config.service';
import { AppService } from 'merit/core/app-settings.service';
import { BwcService } from 'merit/core/bwc.service';

import * as _ from 'lodash';
import { Logger } from "merit/core/logger";

@Injectable()
export class PushNotificationsService {
  private navCtrl: NavController;
  private isIOS: boolean;
  private isAndroid: boolean;
  private usePushNotifications: boolean;
  private _token = null;

  constructor(
    public http: HttpClient,
    public profileService: ProfileService,
    public platformService: PlatformService,
    public configService: ConfigService,
    public logger: Logger,
    public appService: AppService,
    private app: App,
    private bwcService: BwcService,
    private FCMPlugin: FCM,
    private platform: Platform
  ) {
    this.logger.info('Hello PushNotificationsService Service');
    this.isIOS = this.platformService.isIOS;
    this.isAndroid = this.platformService.isAndroid;
    this.usePushNotifications = this.platformService.isCordova && !this.platformService.isWP;

    if (this.usePushNotifications) {

      this.platform.ready().then((readySource) => {      

      this.FCMPlugin.onTokenRefresh().subscribe((token: any) => {
        if (!this._token) return;
        this.logger.debug('Refresh and update token for push notifications...');
        this._token = token;
        this.enable();
      });

      this.FCMPlugin.onNotification().subscribe((data: any) => {
        if (!this._token) return;
        this.navCtrl = this.app.getActiveNav(); 
        this.logger.debug('New Event Push onNotification: ' + JSON.stringify(data));
        if (data.wasTapped) {
          // Notification was received on device tray and tapped by the user.
          var walletIdHashed = data.walletId;
          if (!walletIdHashed) return;
          this.navCtrl.setRoot('TransactView');
          this.navCtrl.popToRoot();
          this._openWallet(walletIdHashed);
        } else {
          // Notification was received in foreground. Let's propogate the event
          // (using Ionic Events) to the relevant view.
          this.logger.info("Let's propogate the event!");
          this.profileService.propogateBwsEvent(data, this.profileService.getWallet(data.walletId));
        }
      });
    });
    } else { 
      this.logger.info("WebAppPush:: Push notification subscription happens here.");
      // We are in the web app (not a mobile native app)
      // TODO: Decide if we want to strategically supporting this case.  
      //var firebase = require('https://www.gstatic.com/firebasejs/3.9.0/firebase-messaging.js');
      //var fbMessaging = require('https://www.gstatic.com/firebasejs/3.9.0/firebase-app.js');
    }
  }


  public init(): void {
    if (!this.usePushNotifications || this._token) return;
    this.configService.load().then(() => {
      if (!this.configService.get().pushNotificationsEnabled) return;

      this.logger.debug('Starting push notification registration...');

      //Keep in mind the function will return null if the token has not been established yet.
      this.FCMPlugin.getToken().then((token: any) => {
        this.logger.debug('Get token for push notifications: ' + token);
        this._token = token;
        this.enable();
      });
    });
  }

  public updateSubscription(walletClient: any): void {
    if (!this._token) {
      this.logger.warn('Push notifications disabled for this device. Nothing to do here.');
      return;
    }
    this._subscribe(walletClient);
  }

  public enable(): void {
    if (!this._token) {
      this.logger.warn('No token available for this device. Cannot set push notifications. Needs registration.');
      return;
    }

    var wallets = this.profileService.getWallets();
    _.forEach(wallets, (walletClient: any) => {
      this._subscribe(walletClient);
    });
  };

  public disable(): void {
    if (!this._token) {
      this.logger.warn('No token available for this device. Cannot disable push notifications.');
      return;
    }

    var wallets = this.profileService.getWallets();
    _.forEach(wallets, (walletClient: any) => {
      this._unsubscribe(walletClient);
    });
    this._token = null;
  }

  public unsubscribe(walletClient: any): void {
    if (!this._token) return;
    this._unsubscribe(walletClient);
  }

  private _subscribe(walletClient: any): void {
    let opts = {
      token: this._token,
      platform: this.isIOS ? 'ios' : this.isAndroid ? 'android' : null,
      packageName: this.appService.info.packageNameId
    };
    walletClient.pushNotificationsSubscribe(opts, (err: any) => {
      if (err) this.logger.error(walletClient.name + ': Subscription Push Notifications error. ', JSON.stringify(err));
      else this.logger.debug(walletClient.name + ': Subscription Push Notifications success.');
    });
  }

  private _unsubscribe(walletClient: any): void {
    walletClient.pushNotificationsUnsubscribe(this._token, (err: any) => {
      if (err) this.logger.error(walletClient.name + ': Unsubscription Push Notifications error. ', JSON.stringify(err));
      else this.logger.debug(walletClient.name + ': Unsubscription Push Notifications Success.');
    });
  }

  private _openWallet(walletIdHashed: any): void {
    let wallets = this.profileService.getWallets();
    let wallet: any = _.find(wallets, (w: any) => {
      let walletIdHash = this.bwcService.getSJCL().hash.sha256.hash(parseInt(w.credentials.walletId));
      return _.isEqual(walletIdHashed, this.bwcService.getSJCL().codec.hex.fromBits(walletIdHash));
    });

    if (!wallet) return;

    if (!wallet.isComplete()) {
      this.navCtrl.push('CopayersView', { walletId: wallet.credentials.walletId });
      return;
    }
    this.navCtrl.push('WalletDetailsViews', { walletId: wallet.credentials.walletId });
  }
}
