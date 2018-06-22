import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmailNotificationsService } from '@merit/common/services/email-notification.service';
import { PersistenceService2 } from '@merit/common/services/persistence2.service';
import { PushNotificationsService } from '@merit/common/services/push-notification.service';
import { SmsNotificationsService } from '@merit/common/services/sms-notifications.service';
import { ToastControllerService } from '@merit/common/services/toast-controller.service';
import { isEmpty } from 'lodash';
import { Observable } from 'rxjs/Observable';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { merge } from 'rxjs/observable/merge';
import { debounceTime, filter, switchMap, tap } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';

export type SavingStatus = 'saving' | 'saved' | 'none';

export class NotificationSettingsController {
  formData: FormGroup = this.formBuilder.group({
    pushNotifications: [false],
    emailNotifications: [false, [Validators.required]],
    email: [''],
    smsNotifications: [false],
    phoneNumber: ['', [Validators.required, Validators.pattern(/\d{10,}/)]]
  });

  get emailNotifications() {
    return this.formData.get('emailNotifications');
  }

  get emailNotificationsEnabled() {
    return this.emailNotifications.value == true;
  }

  get email() {
    return this.formData.get('email');
  }

  get smsNotifications() {
    return this.formData.get('smsNotifications');
  }

  get smsNotificationsEnabled() {
    return this.smsNotifications.value == true;
  }

  get phoneNumber() {
    return this.formData.get('phoneNumber');
  }

  private subs: Subscription[] = [];
  private emailStatus: Subject<SavingStatus> = new Subject<SavingStatus>();
  private smsStatus: Subject<SavingStatus> = new Subject<SavingStatus>();

  emailStatus$: Observable<SavingStatus> = this.emailStatus.asObservable();
  smsStatus$: Observable<SavingStatus> = this.smsStatus.asObservable();

  constructor(private persistenceService: PersistenceService2,
              private pushNotificationsService: PushNotificationsService,
              private emailNotificationsService: EmailNotificationsService,
              private smsNotificationsService: SmsNotificationsService,
              private formBuilder: FormBuilder,
              private toastCtrl: ToastControllerService,
              private platform: 'ios' | 'android' | 'desktop') {}

  async init() {
    const settings = await this.persistenceService.getNotificationSettings();

    if (!isEmpty(settings)) {
      this.formData.setValue(settings, { emitEvent: false });
    }

    const status = await this.smsNotificationsService.getSmsSubscriptionStatus();

    if (status) {
      this.smsNotifications.setValue(status.enabled, { emitValue: false });
      this.phoneNumber.setValue(status.phoneNumber || '', { emitValue: false });
    }

    this.subs.push(
      this.formData.valueChanges
        .pipe(
          filter(() => this.formData.valid),
          tap((newValue: any) => this.persistenceService.setNotificationSettings(newValue))
        )
        .subscribe()
    );

    this.subs.push(
      this.formData
        .get('pushNotifications')
        .valueChanges.pipe(
        debounceTime(100),
        tap((enabled: boolean) => {
          if (enabled) {
            this.pushNotificationsService.init();
          } else {
            this.pushNotificationsService.disable();
          }
        })
      )
        .subscribe()
    );

    this.subs.push(
      merge(this.email.valueChanges, this.emailNotifications.valueChanges)
        .pipe(
          tap(() => this.emailStatus.next('none')),
          filter(() => this.emailNotifications.value == false || this.email.valid),
          tap(() => this.emailStatus.next('saving')),
          debounceTime(750),
          switchMap(() =>
            fromPromise(
              this.emailNotificationsService.updateEmail({
                enabled: this.emailNotificationsEnabled,
                email: this.email.value
              })
            )
          ),
          tap(() => {
            this.emailStatus.next('saved');
            if (this.emailNotificationsEnabled && this.email.valid) {
              this.toastCtrl.success('You are now subscribed to Email notifications!');
            }
            this.updateStorage();
          })
        )
        .subscribe()
    );

    this.subs.push(
      merge(this.formData.get('smsNotifications').valueChanges, this.formData.get('phoneNumber').valueChanges)
        .pipe(
          tap(() => this.smsStatus.next('none')),
          filter(() => this.smsNotifications.value == false || this.phoneNumber.valid),
          tap(() => this.smsStatus.next('saving')),
          debounceTime(750),
          switchMap(() =>
            fromPromise(
              this.smsNotificationsService.setSmsSubscription(this.smsNotificationsEnabled, this.formData.get('phoneNumber').value, this.platform)
            )
          ),
          tap(() => {
            this.smsStatus.next('saved');
            if (this.smsNotificationsEnabled && this.phoneNumber.valid) {
              this.toastCtrl.success('You are now subscribed to SMS notifications!');
            }
          })
        )
        .subscribe()
    );
  }

  destroy() {
    this.subs.forEach(sub => {
      try {
        sub.unsubscribe();
      } catch (e) {}
    });
  }

  private updateStorage() {
    return this.persistenceService.setNotificationSettings(this.formData.value);
  }
}
