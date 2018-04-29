import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { DisplayWallet } from '@merit/common/models/display-wallet';
import { IRootAppState } from '@merit/common/reducers';
import { DeleteWalletAction, selectWallets } from '@merit/common/reducers/wallets.reducer';
import { EmailNotificationsService } from '@merit/common/services/email-notification.service';
import { PersistenceService2 } from '@merit/common/services/persistence2.service';
import { ProfileService } from '@merit/common/services/profile.service';
import { PushNotificationsService } from '@merit/common/services/push-notification.service';
import { isWalletEncrypted } from '@merit/common/utils/wallet';
import { ConfirmDialogControllerService } from '@merit/desktop/app/components/confirm-dialog/confirm-dialog-controller.service';
import { PasswordPromptController } from '@merit/desktop/app/components/password-prompt/password-prompt.controller';
import { ToastControllerService } from '@merit/desktop/app/components/toast-notification/toast-controller.service';
import { ElectronService } from '@merit/desktop/services/electron.service';
import { State, Store } from '@ngrx/store';
import { isEmpty } from 'lodash';
import 'rxjs/add/operator/toPromise';
import { merge } from 'rxjs/observable/merge';
import { debounceTime, filter, take, tap } from 'rxjs/operators';

declare const WEBPACK_CONFIG: any;

@Component({
  selector: 'view-settings-preferences',
  templateUrl: './settings-preferences.view.html',
  styleUrls: ['./settings-preferences.view.sass']
})
export class SettingsPreferencesView implements OnInit, OnDestroy {

  get isElectron(): boolean {
    return ElectronService.isElectronAvailable;
  }

  formData: FormGroup = this.formBuilder.group({
    pushNotifications: false,
    emailNotifications: false,
    email: [''] // TODO(ibby): validate email
  });

  get emailNotificationsEnabled() {
    return this.formData.get('emailNotifications').value == true;
  }

  commitHash: string;
  version: string;

  private subs: any[] = [];


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
              private router: Router) {
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

    this.subs.push(
      this.formData.valueChanges
        .pipe(
          filter(() => this.formData.valid),
          tap((newValue: any) => this.persistenceService.setNotificationSettings(newValue))
        )
        .subscribe()
    );

    this.subs.push(
      this.formData.get('pushNotifications').valueChanges
        .pipe(
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
      merge(this.formData.get('email').valueChanges, this.formData.get('emailNotifications').valueChanges)
        .pipe(
          debounceTime(100),
          filter(() => this.formData.valid),
          tap(() =>
            this.emailNotificationsService.updateEmail({
              enabled: this.formData.get('emailNotifications').value,
              email: this.formData.get('email').value
            })
          )
        )
        .subscribe()
    );
  }

  ngOnDestroy() {
    try {
      this.subs.forEach(sub => sub.unsubscribe());
    } catch (e) {
    }
  }

  logout() {
    const dialog = this.confirmDialogCtrl.create(
      'Have you backed up your wallets?',
      'This action will delete all Merit data on your device, so if you have no backup, you will lose your wallets for good.',
      [
        {
          text: 'Delete',
          value: 'delete',
          class: 'primary danger'
        },
        {
          text: 'Cancel'
        }
      ]
    );

    dialog.onDidDismiss(async (value: string) => {
      if (value === 'delete') {
        // TODO delete vaults
        try {
          const wallets = await this.store.select(selectWallets).pipe(take(1)).toPromise();
          await Promise.all(wallets.map(async (wallet: DisplayWallet) => {
            if (isWalletEncrypted(wallet.client)) {
              await new Promise<void>((resolve, reject) => {
                this.passwordPromptCtrl.createForWallet(wallet)
                  .onDidDismiss((password: string) => {
                    if (password) resolve();
                    else reject('You must decrypt you wallet before deleting it.');
                  });
              });
            }

            this.store.dispatch(new DeleteWalletAction(wallet.id));
          }));

          this.toastCtrl.success('All wallets are now deleted!');
        } catch (e) {
          this.toastCtrl.error(e);
        }
      }
    });
  }
}
