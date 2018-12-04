import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonicPage, LoadingController, Platform, ViewController } from 'ionic-angular';
import { SmsNotificationsService } from '@merit/common/services/sms-notifications.service';
import { ToastControllerService } from '@merit/common/services/toast-controller.service';

@IonicPage()
@Component({
  selector: 'modal-sms-notifications',
  templateUrl: 'sms-notifications.html',
})
export class SmsNotificationsModal {
  formData: FormGroup = this.formBuilder.group({
    phoneNumber: ['', [Validators.required, Validators.pattern(/\d{10,}/)]],
  });

  constructor(
    private smsNotificationsService: SmsNotificationsService,
    private viewCtrl: ViewController,
    private toastCtrl: ToastControllerService,
    private formBuilder: FormBuilder,
    private plt: Platform,
    private loadingCtrl: LoadingController,
  ) {}

  async save() {
    const loader = this.loadingCtrl.create({ content: 'Saving settings...' });
    await loader.present();

    const { value } = this.formData.get('phoneNumber');

    try {
      await this.smsNotificationsService.setSmsSubscription(true, value, this.plt.is('ios') ? 'ios' : 'android');
      this.toastCtrl.success('You are now subscribed to SMS notifications');
      this.dismiss();
    } catch (err) {
      this.toastCtrl.error(err);
    } finally {
      await loader.dismiss();
    }
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}
