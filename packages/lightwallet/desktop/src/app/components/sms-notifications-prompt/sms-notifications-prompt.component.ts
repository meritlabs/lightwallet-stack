import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PersistenceService2, UserSettingsKey } from '@merit/common/services/persistence2.service';
import { SmsNotificationsService } from '@merit/common/services/sms-notifications.service';
import { ToastControllerService } from '@merit/common/services/toast-controller.service';
import { IDynamicComponent } from '@merit/desktop/app/components/dom.controller';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Component({
  selector: 'sms-notifications-prompt',
  templateUrl: './sms-notifications-prompt.component.html',
  styleUrls: ['./sms-notifications-prompt.component.sass'],
})
export class SmsNotificationsPromptComponent implements IDynamicComponent {
  formData: FormGroup = this.formBuilder.group({
    phoneNumber: ['', [Validators.required, Validators.pattern(/\d{10,}/)]],
  });

  destroy: Function;

  constructor(
    private smsNotificationsService: SmsNotificationsService,
    private toastCtrl: ToastControllerService,
    private formBuilder: FormBuilder,
    private loadingCtrl: Ng4LoadingSpinnerService,
    private persistenceService: PersistenceService2,
  ) {}

  init() {}

  async save() {
    this.loadingCtrl.show();

    try {
      const { value } = this.formData.get('phoneNumber');
      await this.smsNotificationsService.setSmsSubscription(true, value, 'desktop');

      this.toastCtrl.success('You are now subscribed to SMS notifications');
      this.dismiss();
    } catch (err) {
      this.toastCtrl.error(err);
    } finally {
      this.loadingCtrl.hide();
    }
  }

  async dismiss() {
    await this.persistenceService.setUserSettings(UserSettingsKey.SmsNotificationsPrompt, true);

    if (typeof this.destroy === 'function') {
      this.destroy();
    }
  }

  onBackdropClick() {
    this.dismiss();
  }
}
