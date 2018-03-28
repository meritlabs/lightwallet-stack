import { Injectable } from '@angular/core';
import { PushNotificationsService } from '@merit/common/services/push-notification.service';
import { HttpClient } from '@angular/common/http';
import { PersistenceService2 } from '@merit/common/services/persistence2.service';
import { LoggerService } from '@merit/common/services/logger.service';
import firebase from '@firebase/app';
import { filter, map, take } from 'rxjs/operators';
import '@firebase/messaging';
import { NotificationData } from '@ionic-native/fcm';
import { Store } from '@ngrx/store';
import { IRootAppState } from '@merit/common/reducers';
import { selectWallets } from '@merit/common/reducers/wallets.reducer';
import { DisplayWallet } from '@merit/common/models/display-wallet';

const FirebaseAppConfig = {
  apiKey: 'AIzaSyDsHxVE243LOlN05qBiElm_P65uCMQr-r8',
  projectId: 'prime-service-181121',
  messagingSenderId: '1091326413792'
};


@Injectable()
export class WebPushNotificationsService extends PushNotificationsService {

  protected get pushNotificationsEnabled(): boolean {
    return this._pushNotificationsEnabled;
  }

  protected get hasPermission(): boolean {
    return this._hasPermission;
  }

  private _pushNotificationsEnabled: boolean;
  private _hasPermission: boolean;
  private firebaseApp;
  private firebaseMessaging;

  constructor(http: HttpClient,
              logger: LoggerService,
              private persistenceService: PersistenceService2,
              private store: Store<IRootAppState>) {
    super(http, logger);
    this.init();
    this.logger.info('Web PushNotifications service is alive!');
  }

  getWallets() {
    return this.store.select(selectWallets)
      .pipe(
        filter((wallets: DisplayWallet[]) => wallets && wallets.length > 0),
        take(1),
        map((wallets: DisplayWallet[]) => wallets.map(wallet => wallet.client))
      )
      .toPromise();
  }

  private async registerSW() {
    try {
      const sw = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
      sw.addEventListener('message', event => {
        console.log('Got a message from our SW =]', event);
      });
      this.firebaseMessaging.useServiceWorker(sw);
    } catch (e) {
      this.logger.error('Unable to register FCM Service Worker', e && e.message ? e.message : e);
    }
  }

  async init() {
    const settings = await this.persistenceService.getNotificationSettings() || {};
    this._pushNotificationsEnabled = Boolean(settings.pushNotifications);

    if (this.pushNotificationsEnabled) {
      this.firebaseApp = firebase.initializeApp(FirebaseAppConfig);
      this.firebaseMessaging = firebase.messaging(this.firebaseApp);
      await this.registerSW();
      try {
        await this.requestPermission();
        this._hasPermission = true;
      } catch (e) {
        console.log(e);
        this.logger.info('Push notifications permission was denied');
      }

      await this.getToken();
      this.subscribeToEvents();
      this.enable();
    }
  }

  requestPermission() {
    return this.firebaseMessaging.requestPermission();
  }

  async getToken() {
    if (!this.hasPermission) return;
    this.token = await this.firebaseMessaging.getToken();
    this.logger.info('Token is ', this.token);
    return this.token;
  }

  async subscribeToEvents() {
    this.firebaseMessaging.onMessage((data: NotificationData) => {
      console.log('~~ Got a new notification: ', data);
    });

    this.firebaseMessaging.onTokenRefresh((token: string) => {
      this.logger.info('Push Notifications token was refreshed');
      this.token = token;
      this.enable();
    });
  }
}
