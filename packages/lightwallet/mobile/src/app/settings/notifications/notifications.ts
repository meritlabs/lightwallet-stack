import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ConfigService } from '@merit/common/providers/config';
import { AppSettingsService } from '@merit/common/providers/app-settings';
import { PlatformService } from '@merit/common/providers/platform';
import { PushNotificationsService } from '@merit/mobile/app/core/notification/push-notification.service';
import { EmailNotificationsService } from '@merit/mobile/app/core/notification/email-notification.service';
import { EmailValidator } from '@merit/common/email.validator';

@IonicPage()
@Component({
  selector: 'notifications-view',
  templateUrl: 'notifications.html',
})
export class NotificationsView {
  public emailForm: FormGroup;

  public appName: string;
  public usePushNotifications: boolean;
  public isIOSApp: boolean;

  public pushNotifications: boolean;
  public confirmedTxsNotifications: boolean;

  public emailNotifications: boolean;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public formBuilder: FormBuilder,
              private configService: ConfigService,
              private appService: AppSettingsService,
              private platformService: PlatformService,
              private pushService: PushNotificationsService,
              private emailService: EmailNotificationsService) {
    this.emailForm = this.formBuilder.group({
      email: ['', Validators.compose([Validators.required, new EmailValidator(configService, emailService).isValid])]
    });
  }

  ionViewDidLoad() {
    this.updateConfig();
  }

  public pushNotificationsChange() {
    let opts = {
      pushNotificationsEnabled: this.pushNotifications
    };

    this.configService.set(opts);

    if (opts.pushNotificationsEnabled)
      this.pushService.init();
    else
      this.pushService.disable();
  };

  public confirmedTxsNotificationsChange() {
    let opts = {
      confirmedTxsNotifications: {
        enabled: this.confirmedTxsNotifications
      }
    };
    this.configService.set(opts);
  };

  public emailNotificationsChange() {
    let opts = {
      enabled: this.emailNotifications,
      email: this.emailForm.value.email
    };
    this.emailService.updateEmail(opts);
  };

  public saveEmail() {
    this.emailService.updateEmail({
      enabled: this.emailNotifications,
      email: this.emailForm.value.email
    });

  };

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
  };

}
