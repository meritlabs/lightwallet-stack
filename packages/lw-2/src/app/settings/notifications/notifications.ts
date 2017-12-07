import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController, NavParams, IonicPage } from 'ionic-angular';
import { ConfigService } from 'merit/shared/config.service';
import { AppService } from 'merit/core/app-settings.service';
import { PlatformService } from 'merit/core/platform.service';
import { PushNotificationsService } from 'merit/core/push-notification.service';
import { EmailNotificationsService } from 'merit/core/email-notification.service';
import { EmailValidator } from 'merit/shared/email.validator';

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

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    private configService: ConfigService,
    private appService: AppService,
    private platformService: PlatformService,
    private pushService: PushNotificationsService,
    private emailService: EmailNotificationsService
  ) {
    this.emailForm = this.formBuilder.group({
      email: ['', Validators.compose([Validators.required, new EmailValidator(configService, emailService).isValid])]
    });
  }

ionViewDidLoad() {
  console.log('ionViewDidLoad NotificationsPage');
  this.updateConfig();
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
};

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

}
