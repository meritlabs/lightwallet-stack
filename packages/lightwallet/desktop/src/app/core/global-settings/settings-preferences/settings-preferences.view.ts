import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { DisplayWallet } from '@merit/common/models/display-wallet';
import { IRootAppState } from '@merit/common/reducers';
import { SetPrimaryWalletAction } from '@merit/common/reducers/interface-preferences.reducer';
import { DeleteWalletAction, selectWallets } from '@merit/common/reducers/wallets.reducer';
import { EmailNotificationsService } from '@merit/common/services/email-notification.service';
import { PersistenceService2 } from '@merit/common/services/persistence2.service';
import { ProfileService } from '@merit/common/services/profile.service';
import { PushNotificationsService } from '@merit/common/services/push-notification.service';
import { SmsNotificationsService } from '@merit/common/services/sms-notifications.service';
import { NotificationSettingsController } from '@merit/common/utils/notification-settings';
import { isWalletEncrypted } from '@merit/common/utils/wallet';
import { ConfirmDialogControllerService } from '@merit/desktop/app/components/confirm-dialog/confirm-dialog-controller.service';
import { PasswordPromptController } from '@merit/desktop/app/components/password-prompt/password-prompt.controller';
import { ToastControllerService } from '@merit/desktop/app/components/toast-notification/toast-controller.service';
import { ElectronService } from '@merit/desktop/services/electron.service';
import { State, Store } from '@ngrx/store';
import 'rxjs/add/operator/toPromise';
import { take } from 'rxjs/operators';

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

  commitHash: string;
  version: string;

  nsc = new NotificationSettingsController(
    this.persistenceService,
    this.pushNotificationsService,
    this.emailNotificationsService,
    this.smsNotificationsService,
    this.formBuilder,
    this.toastCtrl,
    'desktop',
  );

  constructor(
    private formBuilder: FormBuilder,
    private state: State<IRootAppState>,
    private persistenceService: PersistenceService2,
    private emailNotificationsService: EmailNotificationsService,
    private pushNotificationsService: PushNotificationsService,
    private toastCtrl: ToastControllerService,
    private confirmDialogCtrl: ConfirmDialogControllerService,
    private passwordPromptCtrl: PasswordPromptController,
    private profileService: ProfileService,
    private store: Store<IRootAppState>,
    private smsNotificationsService: SmsNotificationsService,
  ) {
    if (typeof WEBPACK_CONFIG !== 'undefined') {
      this.commitHash = WEBPACK_CONFIG.COMMIT_HASH;
      this.version = WEBPACK_CONFIG.VERSION;
    }
  }

  async ngOnInit() {
    await this.nsc.init();

    if (this.isElectron) this.nsc.formData.get('pushNotifications').setValue(false);
  }

  ngOnDestroy() {
    this.nsc.destroy();
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
      ],
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

              await this.persistenceService.resetUserSettings();
              this.store.dispatch(new SetPrimaryWalletAction(null));
              this.store.dispatch(new DeleteWalletAction(wallet.id));
            }),
          );

          this.toastCtrl.success('All wallets are now deleted!');
        } catch (e) {
          this.toastCtrl.error(e);
        }
      }
    });
  }
}
