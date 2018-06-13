import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DisplayWallet } from '@merit/common/models/display-wallet';
import { IRootAppState } from '@merit/common/reducers';
import { DeleteWalletAction, selectWallets } from '@merit/common/reducers/wallets.reducer';
import { EmailNotificationsService } from '@merit/common/services/email-notification.service';
import { PersistenceService2, ViewSettingsKey } from '@merit/common/services/persistence2.service';
import { ProfileService } from '@merit/common/services/profile.service';
import { PushNotificationsService } from '@merit/common/services/push-notification.service';
import { SmsNotificationsService } from '@merit/common/services/sms-notifications.service';
import { isWalletEncrypted } from '@merit/common/utils/wallet';
import { ConfirmDialogControllerService } from '@merit/desktop/app/components/confirm-dialog/confirm-dialog-controller.service';
import { PasswordPromptController } from '@merit/desktop/app/components/password-prompt/password-prompt.controller';
import { ToastControllerService } from '@merit/desktop/app/components/toast-notification/toast-controller.service';
import { ElectronService } from '@merit/desktop/services/electron.service';
import { State, Store } from '@ngrx/store';
import { isEmpty } from 'lodash';
import 'rxjs/add/operator/toPromise';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { merge } from 'rxjs/observable/merge';
import { debounceTime, filter, switchMap, take, tap } from 'rxjs/operators';

declare const WEBPACK_CONFIG: any;

@Component({
  selector: 'view-settings-preferences',
  templateUrl: './settings-preferences.view.html',
  styleUrls: ['./settings-preferences.view.sass'],
})
export class SettingsPreferencesView implements OnInit, OnDestroy {

  get isElectron(): boolean {
    return ElectronService.isElectronAvailable;
  }

  formData: FormGroup = this.formBuilder.group({
    pushNotifications: [false],
    emailNotifications: [false],
    email: [''],
    smsNotifications: [false],
    phoneNumber: ['', [Validators.minLength(10), Validators.pattern(/\d+/)]]
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

  commitHash: string;
  version: string;

  private subs: any[] = [];

  savingEmail: boolean;
  savingPhoneNumber: boolean;

  constructor(private formBuilder: FormBuilder,
              private state: State<IRootAppState>,
              private persistenceService: PersistenceService2,
              private emailNotificationsService: EmailNotificationsService,
              private pushNotificationsService: PushNotificationsService,
              private toastCtrl: ToastControllerService,
              private confirmDialogCtrl: ConfirmDialogControllerService,
              private passwordPromptCtrl: PasswordPromptController,
              private profileService: ProfileService,
              private store: Store<IRootAppState>,
              private smsNotificationsService: SmsNotificationsService) {
    if (typeof WEBPACK_CONFIG !== 'undefined') {
      this.commitHash = WEBPACK_CONFIG.COMMIT_HASH;
      this.version = WEBPACK_CONFIG.VERSION;
    }
  }

  async ngOnInit() {
    const settings = await this.persistenceService.getNotificationSettings();
    if (!isEmpty(settings)) {
      this.formData.setValue(settings, { emitEvent: false });
    }

    const status = await this.smsNotificationsService.getSmsSubscriptionStatus();

    if (status && status.enabled) {
      this.formData.get('smsNotifications').setValue(status.enabled, { emitValue: false });
      this.formData.get('phoneNumber').setValue(status.phoneNumber, { emitValue: false });
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
          filter(() => this.emailNotifications.value == false || this.email.valid),
          tap(() => this.savingEmail = true),
          debounceTime(500),
          switchMap(() =>
            fromPromise(
              this.emailNotificationsService.updateEmail({
                enabled: this.formData.get('emailNotifications').value,
                email: this.formData.get('email').value
              })
            )
          ),
          tap(() => this.savingEmail = false)
        )
        .subscribe()
    );

    this.subs.push(
      merge(this.formData.get('smsNotifications').valueChanges, this.formData.get('phoneNumber').valueChanges)
        .pipe(
          filter(() => this.smsNotifications.value == false || this.phoneNumber.valid),
          tap(() => this.savingPhoneNumber = true),
          debounceTime(500),
          switchMap(() =>
            fromPromise(
              this.smsNotificationsService.setSmsSubscription(this.smsNotificationsEnabled, this.formData.get('phoneNumber').value, 'desktop')
            )
          ),
          tap(() => this.savingPhoneNumber = false)
        )
        .subscribe()
    );

    if (this.isElectron) this.formData.get('pushNotifications').setValue(false);
  }

  ngOnDestroy() {
    try {
      this.subs.forEach(sub => sub.unsubscribe());
    } catch (e) {}
  }

  logout() {
    const dialog = this.confirmDialogCtrl.create(
      'Have you backed up your wallets?',
      'This action will delete all Merit data on your device, so if you have no backup, you will lose your wallets for good.',
      [
        {
          text: 'Delete',
          value: 'delete',
          class: 'primary danger',
        },
        {
          text: 'Cancel',
        },
      ]
    );

    dialog.onDidDismiss(async (value: string) => {
      if (value === 'delete') {
        // TODO delete vaults
        try {
          const wallets = await this.store
            .select(selectWallets)
            .pipe(take(1))
            .toPromise();

          await Promise.all(
            wallets.map(async (wallet: DisplayWallet) => {
              if (isWalletEncrypted(wallet.client)) {
                await new Promise<void>((resolve, reject) => {
                  this.passwordPromptCtrl.createForWallet(wallet).onDidDismiss((password: string) => {
                    if (password) resolve();
                    else reject('You must decrypt you wallet before deleting it.');
                  });
                });
              }

              await this.persistenceService.resetViewSettings();

              this.store.dispatch(new DeleteWalletAction(wallet.id));
            })
          );

          this.toastCtrl.success('All wallets are now deleted!');
        } catch (e) {
          this.toastCtrl.error(e);
        }
      }
    });
  }
}
