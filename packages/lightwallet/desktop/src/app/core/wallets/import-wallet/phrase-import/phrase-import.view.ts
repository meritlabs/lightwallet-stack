import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ENV } from '@app/env';
import { DerivationPath } from '@merit/common/utils/derivation-path';
import { ProfileService } from '@merit/common/services/profile.service';
import { MnemonicService } from '@merit/common/services/mnemonic.service';
import { startsWith } from 'lodash';

@Component({
  selector: 'view-phrase-import',
  templateUrl: './phrase-import.view.html',
  styleUrls: ['./phrase-import.view.scss']
})
export class PhraseImportView {

  formData: FormGroup = this.formBuilder.group({
    words: '',
    password: '',
    mwsUrl: ENV.mwsUrl
  });

  private derivationPath = ENV.network == 'livenet' ?
    DerivationPath.getDefault() :
    DerivationPath.getDefaultTestnet();

  constructor(private formBuilder: FormBuilder,
              private profileService: ProfileService,
              private mnemonicService: MnemonicService) {}


  async importMnemonic() {
    // const loader = this.loadingCtrl.create({ content: 'Importing wallet' });
    // loader.present();

    const { words, password, mwsUrl } = this.formData.getRawValue();

    try {
      const pathData = DerivationPath.parse(this.derivationPath);
      if (!pathData) {
        throw new Error('Invalid derivation path');
      }

      const opts: any = {
        account: pathData.account,
        networkName: pathData.networkName,
        derivationStrategy: pathData.derivationStrategy
      };

      let wallet;

      if (words.indexOf('xprv') == 0 || words.indexOf('tprv') == 0) {
        wallet = await this.profileService.importExtendedPrivateKey(words, opts);
      } else if (words.indexOf('xpub') == 0 || words.indexOf('tpub') == 0) {
        opts.extendedPublicKey = words;
        wallet = await this.profileService.importExtendedPublicKey(opts);
      } else {
        opts.passphrase = password;
        wallet = await this.mnemonicService.importMnemonic(words, opts);
      }

      if (wallet) {
        this.profileService.setBackupFlag(wallet.credentials.walletId);
        // this.pushNotificationsService.subscribe(wallet);

        console.log('Done importing wallet!');
        return;
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

      // this.toastCtrl.create({
      //   message: errorMsg,
      //   cssClass: ToastConfig.CLASS_ERROR
      // }).present();
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
