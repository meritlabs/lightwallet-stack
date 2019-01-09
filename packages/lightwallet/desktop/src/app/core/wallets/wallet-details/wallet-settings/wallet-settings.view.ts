import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DisplayWallet } from '@merit/common/models/display-wallet';
import { IRootAppState } from '@merit/common/reducers';
import { selectPrimaryWallet, SetPrimaryWalletAction } from '@merit/common/reducers/interface-preferences.reducer';
import { DeleteWalletAction, selectWalletById, UpdateOneWalletAction } from '@merit/common/reducers/wallets.reducer';
import { LoggerService } from '@merit/common/services/logger.service';
import { WalletService } from '@merit/common/services/wallet.service';
import { getLatestValue } from '@merit/common/utils/observables';
import { PasswordValidator } from '@merit/common/validators/password.validator';
import { ConfirmDialogControllerService } from '@merit/desktop/app/components/confirm-dialog/confirm-dialog-controller.service';
import { PasswordPromptController } from '@merit/desktop/app/components/password-prompt/password-prompt.controller';
import { ToastControllerService } from '@merit/desktop/app/components/toast-notification/toast-controller.service';
import { Store } from '@ngrx/store';
import { debounceTime, filter, switchMap } from 'rxjs/operators';
import { WalletSettingsColors } from '@merit/common/const/wallet-colors';

@Component({
  selector: 'view-wallet-settings',
  templateUrl: './wallet-settings.view.html',
  styleUrls: ['./wallet-settings.view.sass'],
})
export class WalletSettingsView implements OnInit, OnDestroy {
  availableColors: any = WalletSettingsColors;
  selectedColor: any;

  wallet: DisplayWallet;

  settingsForm = this.formBuilder.group({
    name: ['', Validators.required],
    balanceHidden: false,
  });

  passwordChangeForm = this.formBuilder.group({
    password: ['', Validators.required],
    repeatPassword: ['', [Validators.required, PasswordValidator.MatchPassword]],
  });

  get password() {
    return this.passwordChangeForm.get('password');
  }

  get repeatPassword() {
    return this.passwordChangeForm.get('repeatPassword');
  }

  get currentPassword() {
    return this.passwordChangeForm.get('currentPassword');
  }

  isWalletEncrypted: boolean;

  private subs: any[] = [];

  constructor(
    private store: Store<IRootAppState>,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private logger: LoggerService,
    private walletService: WalletService,
    private passwordPromptCtrl: PasswordPromptController,
    private confirmDialogCtrl: ConfirmDialogControllerService,
    private router: Router,
    private toastCtrl: ToastControllerService,
  ) {}

  ngOnInit() {
    this.subs.push(
      this.route.parent.params
        .pipe(switchMap(({ id }) => this.store.select(selectWalletById(id))))
        .subscribe((wallet: DisplayWallet) => {
          if (!wallet) return this.router.navigateByUrl('/wallets');

          this.wallet = wallet;

          const isEncrypted: boolean = wallet.client.isPrivKeyEncrypted();

          if (isEncrypted) {
            this.setWalletAsEncrypted();
          }

          this.settingsForm.get('name').setValue(wallet.name);
          this.settingsForm.get('balanceHidden').setValue(wallet.balanceHidden);

          this.selectedColor = this.availableColors.find(c => wallet.color == c.color);

          this.subs.push(
            this.settingsForm.valueChanges
              .pipe(
                debounceTime(100),
                filter(() => this.settingsForm.valid),
              )
              .subscribe(({ name, balanceHidden }) => {
                this.wallet.name = name;
                this.wallet.balanceHidden = balanceHidden;
                this.store.dispatch(new UpdateOneWalletAction(this.wallet));
              }),
          );
        }),
    );
  }

  private setWalletAsEncrypted() {
    // wallet is encrypted and we need a password to decrypt before setting a new password
    this.passwordChangeForm.addControl(
      'currentPassword',
      this.formBuilder.control('', [Validators.required, PasswordValidator.VerifyWalletPassword(this.wallet.client)]),
    );
    this.isWalletEncrypted = true;
  }

  async savePassword() {
    const { currentPassword, password } = this.passwordChangeForm.getRawValue();

    try {
      if (this.isWalletEncrypted) {
        this.wallet.client.decryptPrivateKey(currentPassword);
      }

      await this.walletService.encryptWallet(this.wallet.client, password);
      this.setWalletAsEncrypted();

      this.logger.info('Encrypted wallet!');
      this.toastCtrl.success('Your wallet is now encrypted!');
    } catch (e) {
      this.logger.error('Unable to set wallet password', e);
    }
  }

  ngOnDestroy() {
    try {
      this.subs.forEach(sub => sub.unsubscribe());
    } catch (e) {}
  }

  selectColor(selectedColor: any) {
    this.selectedColor = selectedColor;
    this.wallet.color = selectedColor.color;
    this.store.dispatch(new UpdateOneWalletAction(this.wallet));
  }

  deleteWallet() {
    const confirmDialog = this.confirmDialogCtrl.create(
      'Confirm action',
      'Are you sure you would like to delete this wallet? This action can not be reversed.',
      [
        {
          text: 'Yes',
          value: 'yes',
          class: 'primary danger',
        },
        {
          text: 'No',
          value: 'no',
        },
      ],
    );

    confirmDialog.onDidDismiss(async (value: string) => {
      if (value === 'yes') {
        try {
          // check if encrypted & prompt for password first
          if (this.isWalletEncrypted) {
            await new Promise<void>((resolve, reject) => {
              this.passwordPromptCtrl.createForWallet(this.wallet).onDidDismiss((password: string) => {
                if (password) resolve();
                else reject('You must decrypt your wallet before deleting it.');
              });
            });
          }

          this.store.dispatch(new DeleteWalletAction(this.wallet.id));
          const primaryWallet = await getLatestValue(this.store.select(selectPrimaryWallet));
          if (primaryWallet && this.wallet.id == primaryWallet.id) {
            this.store.dispatch(new SetPrimaryWalletAction(null));
          }
        } catch (err) {
          this.toastCtrl.error(err);
        }
      }
    });
  }
}
