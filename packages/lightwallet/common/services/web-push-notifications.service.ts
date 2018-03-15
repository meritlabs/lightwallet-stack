import { Injectable } from '@angular/core';
import { PushNotificationService } from '@merit/common/services/push-notification.service';
import { HttpClient } from '@angular/common/http';
import { PersistenceService2 } from '@merit/common/services/persistence2.service';
import { LoggerService } from '@merit/common/services/logger.service';
import firebase from '@firebase/app';
import { Observable } from 'rxjs/Observable';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { retry } from 'rxjs/operators';
import '@firebase/messaging';

const FirebaseAppConfig = {
  apiKey: 'AIzaSyDsHxVE243LOlN05qBiElm_P65uCMQr-r8',
  projectId: 'prime-service-181121',
  messagingSenderId: '1091326413792'
};


@Injectable()
export class WebPushNotificationsService extends PushNotificationService {

  protected get pushNotificationsEnabled(): boolean {
    return this._pushNotificationsEnabled;
  }

  protected get hasPermission(): boolean {
    return this._hasPermission;
  }

  private _pushNotificationsEnabled: boolean;
  private _hasPermission: boolean;
  private firebaseApp;

  constructor(http: HttpClient,
              logger: LoggerService,
              private persistenceService: PersistenceService2) {
    super(http, logger);
    this.init();
    this.logger.info('Web PushNotifications service is alive!');
  }

  private async init() {
    const settings = await this.persistenceService.getNotificationSettings() || {};
    this._pushNotificationsEnabled = Boolean(settings.pushNotifications);

    // if (this.pushNotificationsEnabled) {
    this.firebaseApp = firebase.initializeApp(FirebaseAppConfig);
    try {
      await this.requestPermission();
      this._hasPermission = true;
    } catch (e) {
      console.log(e);
      this.logger.info('Push notifications permission was denied');
    }

    await this.getToken();
    // }
  }

  requestPermission() {
    return firebase.messaging().requestPermission();
  }

  async getToken() {
    if (!this.hasPermission) return;
    this.token = await firebase.messaging().getToken();
  }
}
