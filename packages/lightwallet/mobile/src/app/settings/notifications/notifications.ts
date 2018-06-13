import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppSettingsService } from '@merit/common/services/app-settings.service';
import { ConfigService } from '@merit/common/services/config.service';
import { EmailNotificationsService } from '@merit/common/services/email-notification.service';
import { PlatformService } from '@merit/common/services/platform.service';
import { PushNotificationsService } from '@merit/common/services/push-notification.service';
import { EmailValidator } from '@merit/common/validators/email.validator';
import { IonicPage, LoadingController, NavController, NavParams } from 'ionic-angular';
import { SmsNotificationsService } from '../../../../../common/services/sms-notifications.service';

@IonicPage()
@Component({
  selector: 'notifications-view',
  templateUrl: 'notifications.html'
})
export class NotificationsView {
  emailForm: FormGroup = this.formBuilder.group({
    email: ['', Validators.compose([Validators.required, <any>(EmailValidator.isValid(this.configService, this.emailService))])]
  });

  smsForm: FormGroup = this.formBuilder.group({
    phoneNumber: ['', [Validators.minLength(10), Validators.pattern(/\d+/)]]
  });

  appName: string;
  usePushNotifications: boolean;
  isIOSApp: boolean;

  pushNotifications: boolean;
  confirmedTxsNotifications: boolean;

  emailNotifications: boolean;
  smsNotifications: boolean;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public formBuilder: FormBuilder,
              private configService: ConfigService,
              private appService: AppSettingsService,
              private platformService: PlatformService,
              private pushService: PushNotificationsService,
              private emailService: EmailNotificationsService,
              private loadingCtrl: LoadingController,
              private smsNotificationsService: SmsNotificationsService
  ) {}

  async ngOnInit() {
    const status = await this.smsNotificationsService.getSmsSubscriptionStatus();
    this.smsNotifications = status.enabled;
  }

  ionViewDidLoad() {
    this.updateConfig();
  }

  async pushNotificationsChange() {
    const opts = {
      pushNotificationsEnabled: this.pushNotifications
    };

    this.configService.set(opts);

    if (opts.pushNotificationsEnabled) {
      await this.pushService.init();
      await this.pushService.enable();
    }
    else
      return this.pushService.disable();
  }

  emailNotificationsChange() {
    let opts = {
      enabled: this.emailNotifications,
      email: this.emailForm.value.email
    };
    this.emailService.updateEmail(opts);
  }

  smsNotificationsChange() {
    if (!this.smsNotifications) {
      return this.smsNotificationsService.setSmsSubscription(false);
    }

    const phoneNumber = this.smsForm.get('phoneNumber');

    if (phoneNumber.valid) {
      return this.smsNotificationsService.setSmsSubscription(true, phoneNumber.value, this.platformService.isIOS? 'ios' : 'android')
    }
  }

  async saveEmail() {
    let loader = this.loadingCtrl.create({
      content: 'Saving changes...',
      dismissOnPageChange: true
    });
    loader.present();
    await this.emailService.updateEmail({
      enabled: this.emailNotifications,
      email: this.emailForm.value.email
    });
    loader.dismiss();
    this.navCtrl.pop();
  }

  private updateConfig() {
    let config = this.configService.get();
    this.appName = this.appService.info.nameCase;
    this.usePushNotifications = this.platformService.isCordova;
    this.isIOSApp = this.platformService.isIOS && this.platformService.isCordova;

    this.pushNotifications = config.pushNotificationsEnabled;
    this.confirmedTxsNotifications = config.confirmedTxsNotifications ? config.confirmedTxsNotifications.enabled : false;

    this.emailForm.setValue({
      email: this.emailService.getEmailIfEnabled(config) || ''
    });

    this.emailNotifications = config.emailNotifications ? config.emailNotifications.enabled : false;
  }

}
