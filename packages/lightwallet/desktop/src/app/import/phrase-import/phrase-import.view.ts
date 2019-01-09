import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ENV } from '@app/env';
import { createDisplayWallet } from '@merit/common/models/display-wallet';
import { IRootAppState } from '@merit/common/reducers';
import { UpdateAppAction } from '@merit/common/reducers/app.reducer';
import { AddWalletAction } from '@merit/common/reducers/wallets.reducer';
import { AddressService } from '@merit/common/services/address.service';
import { MnemonicService } from '@merit/common/services/mnemonic.service';
import { ProfileService } from '@merit/common/services/profile.service';
import { PushNotificationsService } from '@merit/common/services/push-notification.service';
import { TxFormatService } from '@merit/common/services/tx-format.service';
import { PersistenceService2, UserSettingsKey } from '@merit/common/services/persistence2.service';
import { WalletService } from '@merit/common/services/wallet.service';
import { DerivationPath } from '@merit/common/utils/derivation-path';
import { MnemonicValidator } from '@merit/common/validators/mnemonic.validator';
import { Store } from '@ngrx/store';
import { startsWith } from 'lodash';
import { ToastControllerService } from '@merit/desktop/app/components/toast-notification/toast-controller.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Component({
  selector: 'view-phrase-import',
  templateUrl: './phrase-import.view.html',
  styleUrls: ['./phrase-import.view.scss'],
})
export class PhraseImportView {
  formData: FormGroup = this.formBuilder.group({
    words: ['', [Validators.required, MnemonicValidator.validateMnemonicImport]],
  });

  showPass: boolean;

  private derivationPath = ENV.network == 'livenet' ? DerivationPath.getDefault() : DerivationPath.getDefaultTestnet();

  constructor(
    private formBuilder: FormBuilder,
    private profileService: ProfileService,
    private mnemonicService: MnemonicService,
    private store: Store<IRootAppState>,
    private walletService: WalletService,
    private addressService: AddressService,
    private txFormatService: TxFormatService,
    private router: Router,
    private pushNotificationsService: PushNotificationsService,
    private toastCtrl: ToastControllerService,
    private loadingCtrl: Ng4LoadingSpinnerService,
    private persistenceService2: PersistenceService2,
  ) {}

  async importMnemonic() {
    this.loadingCtrl.show();

    let { words } = this.formData.getRawValue();
    words = words.replace(/\s\s+/g, ' ').trim();

    try {
      const pathData = DerivationPath.parse(this.derivationPath);
      if (!pathData) {
        throw new Error('Invalid derivation path');
      }

      const opts: any = {
        account: pathData.account,
        networkName: pathData.networkName,
        derivationStrategy: pathData.derivationStrategy,
      };

      let wallet;

      if (words.indexOf('xprv') == 0 || words.indexOf('tprv') == 0) {
        wallet = await this.walletService.importExtendedPrivateKey(words, opts);
      } else if (words.indexOf('xpub') == 0 || words.indexOf('tpub') == 0) {
        opts.extendedPublicKey = words;
        wallet = await this.walletService.importExtendedPublicKey(opts);
      } else {
        wallet = await this.mnemonicService.importMnemonic(words, opts);
      }

      if (wallet) {
        this.pushNotificationsService.subscribe(wallet);

        this.store.dispatch(
          new AddWalletAction(
            await createDisplayWallet(
              wallet,
              this.walletService,
              this.addressService,
              this.txFormatService,
              this.persistenceService2,
            ),
          ),
        );

        // update state so we're allowed to access the dashboard, in case this is done via onboarding import
        this.store.dispatch(
          new UpdateAppAction({
            loading: false,
            authorized: true,
          }),
        );

        this.loadingCtrl.hide();
        this.persistenceService2.setUserSettings(UserSettingsKey.recordPassphrase, true);

        return this.router.navigateByUrl('/wallets');
      }

      throw new Error('An unexpected error occurred while importing your wallet.');
    } catch (err) {
      // loader.dismiss();

      let errorMsg = 'Failed to import wallet';
      if (err && err.message) {
        errorMsg = err.message;
      } else if (typeof err === 'string') {
        errorMsg = err;
      }

      this.loadingCtrl.hide();

      return this.toastCtrl.error(errorMsg);
    }
  }

  mnemonicImportAllowed() {
    let { words } = this.formData.getRawValue();
    words = words ? words.replace(/\s\s+/g, ' ').trim() : '';

    if (!words) return false;

    if (startsWith('xprv') || startsWith('tprv') || startsWith('xpub') || startsWith('tpuv')) {
      return true;
    } else {
      return !(words.split(/[\u3000\s]+/).length % 3);
    }
  }
}
