import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ConfigService } from '@merit/common/services/config.service';
import { AppSettingsService } from '@merit/common/services/app-settings.service';
import { PlatformService } from '@merit/common/services/platform.service';
import { EmailValidator } from '@merit/common/validators/email.validator';
import { EmailNotificationsService } from '@merit/common/services/email-notification.service';
import { PushNotificationsService } from '@merit/common/services/push-notification.service';

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
      email: ['', Validators.compose([Validators.required, <any>(new EmailValidator(configService, emailService).isValid)])]
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
