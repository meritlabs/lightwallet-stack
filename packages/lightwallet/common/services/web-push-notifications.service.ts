import { Injectable } from '@angular/core';
import { PushNotificationService } from '@merit/common/services/push-notification.service';
import { HttpClient } from '@angular/common/http';
import { PersistenceService2 } from '@merit/common/services/persistence2.service';
import { LoggerService } from '@merit/common/services/logger.service';
import firebase from '@firebase/app';
import { Observable } from 'rxjs/Observable';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { retry } from 'rxjs/operators';

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

  private _pushNotificationsEnabled: boolean;
  private firebaseApp;

  constructor(http: HttpClient,
              logger: LoggerService,
              private persistenceService: PersistenceService2) {
    super(http, logger);
    this.init();
  }

  private async init() {
    const settings = await this.persistenceService.getNotificationSettings() || {};
    this._pushNotificationsEnabled = Boolean(settings.pushNotifications);

    if (this.pushNotificationsEnabled) {
      firebase.initializeApp(FirebaseAppConfig);
    }
  }

  async getToken() {
    const sub = Observable.defer(() => fromPromise(this.firebaseApp.messaging().getToken()))
      .pipe(
        retry(3)
      )
      .subscribe((data: any) => {
        console.log('Token is ', data);
        sub.unsubscribe();
      });
  }
}
