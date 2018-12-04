import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import firebase from '@firebase/app';
import '@firebase/messaging';
import { NotificationData } from '@ionic-native/fcm';
import { DisplayWallet } from '@merit/common/models/display-wallet';
import { IRootAppState } from '@merit/common/reducers';
import { AddNotificationAction } from '@merit/common/reducers/notifications.reducer';
import { RefreshOneWalletAction, selectWallets } from '@merit/common/reducers/wallets.reducer';
import { LoggerService } from '@merit/common/services/logger.service';
import { INotificationSettings, PersistenceService2 } from '@merit/common/services/persistence2.service';
import { PollingNotificationsService } from '@merit/common/services/polling-notification.service';
import { PushNotificationsService } from '@merit/common/services/push-notification.service';
import { Store } from '@ngrx/store';
import { filter, map, take } from 'rxjs/operators';

const FirebaseAppConfig = {
  apiKey: 'APIKEY',
  projectId: 'prime-service-181121',
  messagingSenderId: '1091326413792',
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

  constructor(
    http: HttpClient,
    logger: LoggerService,
    private pollingNotificationService: PollingNotificationsService,
    private persistenceService: PersistenceService2,
    private store: Store<IRootAppState>,
  ) {
    super(http, logger);
    this.logger.info('Web PushNotifications service is alive!');
    this.platform = 'web';
    this.packageName = location.origin;
  }

  getWallets() {
    return this.store
      .select(selectWallets)
      .pipe(
        filter((wallets: DisplayWallet[]) => wallets && wallets.length > 0),
        take(1),
        map((wallets: DisplayWallet[]) => wallets.map(wallet => wallet.client)),
      )
      .toPromise();
  }

  enablePolling() {
    this.logger.info('Enabling polling notifications');
    this.pollingNotificationService.enable();
  }

  disablePolling() {
    this.pollingNotificationService.disable();
  }

  private async registerSW() {
    try {
      const sw = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
      this.firebaseMessaging.useServiceWorker(sw);
    } catch (e) {
      this.logger.error('Unable to register FCM Service Worker', e && e.message ? e.message : e);
    }
  }

  async init() {
    const settings: INotificationSettings = await this.persistenceService.getNotificationSettings();
    this._pushNotificationsEnabled = Boolean(settings.pushNotifications);

    if (this.pushNotificationsEnabled) {
      if (!this.token) {
        this.firebaseApp = firebase.apps.length ? firebase.app() : firebase.initializeApp(FirebaseAppConfig);
        this.firebaseMessaging = firebase.messaging(this.firebaseApp);
        await this.registerSW();
        try {
          await this.requestPermission();
          this._hasPermission = true;
        } catch (e) {
          this.logger.error(e);
          this.logger.info('Push notifications permission was denied');
          this._hasPermission = false;
          await this.persistenceService.setNotificationSettings({
            ...settings,
            pushNotifications: false,
          });
          this.enablePolling();
          return;
        }

        await this.getToken();
        this.subscribeToEvents();
      }

      this.enable();
    } else {
      this.logger.info('Push notifications are disabled or not supported');
      this.enablePolling();
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
      if (data.data) {
        this.store.dispatch(
          new AddNotificationAction({
            ...data.data,
            timestamp: Date.now(),
            read: false,
          }),
        );

        if (data.data.walletId) {
          this.store.dispatch(
            new RefreshOneWalletAction(data.data.walletId, {
              skipAlias: true,
              skipShareCode: true,
            }),
          );
        }
      }
    });

    this.firebaseMessaging.onTokenRefresh((token: string) => {
      this.logger.info('Push Notifications token was refreshed');
      this.token = token;
      this.enable();
    });
  }
}
