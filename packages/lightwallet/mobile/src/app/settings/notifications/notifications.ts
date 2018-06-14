import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppSettingsService } from '@merit/common/services/app-settings.service';
import { ConfigService } from '@merit/common/services/config.service';
import { EmailNotificationsService } from '@merit/common/services/email-notification.service';
import { PlatformService } from '@merit/common/services/platform.service';
import { PushNotificationsService } from '@merit/common/services/push-notification.service';
import { EmailValidator } from '@merit/common/validators/email.validator';
import { IonicPage, LoadingController, NavController, NavParams } from 'ionic-angular';
import { isEmpty } from 'lodash';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { merge } from 'rxjs/observable/merge';
import { debounceTime, filter, switchMap, tap } from 'rxjs/operators';
import { Subscription } from 'rxjs/Subscription';
import { PersistenceService2 } from '../../../../../common/services/persistence2.service';
import { SmsNotificationsService } from '../../../../../common/services/sms-notifications.service';
import { ToastControllerService } from '../../../../../common/services/toast-controller.service';
import { NotificationSettingsController } from '../../../../../common/utils/notification-settings';

@IonicPage()
@Component({
  selector: 'notifications-view',
  templateUrl: 'notifications.html'
})
export class NotificationsView {
  usePushNotifications: boolean = this.platformService.isCordova;

  nsc = new NotificationSettingsController(
    this.persistenceService,
    this.pushNotificationsService,
    this.emailNotificationsService,
    this.smsNotificationsService,
    this.formBuilder,
    this.toastCtrl,
    this.platformService.isIOS? 'ios' : 'android'
  );

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public formBuilder: FormBuilder,
              private configService: ConfigService,
              private appService: AppSettingsService,
              private platformService: PlatformService,
              private pushNotificationsService: PushNotificationsService,
              private emailNotificationsService: EmailNotificationsService,
              private loadingCtrl: LoadingController,
              private smsNotificationsService: SmsNotificationsService,
              private persistenceService: PersistenceService2,
              private toastCtrl: ToastControllerService
  ) {}

  ngOnInit() {
    return this.nsc.init();
  }

  ngOnDestroy() {
    this.nsc.destroy();
  }
}
