import { Component, ElementRef, ViewChild } from '@angular/core';
import { App, IonicPage, LoadingController } from 'ionic-angular';
import { BwcService } from 'merit/core/bwc.service';
import { Logger } from 'merit/core/logger';
import { ProfileService } from 'merit/core/profile.service';
import { ToastConfig } from 'merit/core/toast.config';
import { MeritToastController } from 'merit/core/toast.controller';
import { AddressScannerService } from 'merit/utilities/import/address-scanner.service';
import { DerivationPathService } from 'merit/utilities/mnemonic/derivation-path.service';
import { MnemonicService } from 'merit/utilities/mnemonic/mnemonic.service';
import { WalletService } from 'merit/wallets/wallet.service';
import { startsWith } from 'lodash';

import { ENV } from '@app/env';

@IonicPage({
  defaultHistory: ['OnboardingView']
})
@Component({
  selector: 'view-import',
  templateUrl: 'import.html',
})
export class ImportView {

  @ViewChild('fileInput') input: ElementRef;

  public segment = 'phrase';
  public formData = {
    words: '',
    phrasePassword: '',
    derivationPath: '',
    fromHardwareWallet: false,
    testnetEnabled: false,
    bwsUrl: '',
    backupFile: null,
    backupFileBlob: '',
    filePassword: '',
    network: '',
    hasPassphrase: false
  };

  public loadFileInProgress = false;
  private sjcl;

  constructor(private bwcService: BwcService,
              private toastCtrl: MeritToastController,
              private logger: Logger,
              private loadingCtrl: LoadingController,
              private profileService: ProfileService,
              private derivationPathService: DerivationPathService,
              private app: App,
              private mnemonicService: MnemonicService,
              private addressScanner: AddressScannerService,
              private walletService: WalletService) {

    this.formData.bwsUrl = ENV.mwsUrl;
    this.formData.network = ENV.network;
    this.formData.derivationPath =
      this.formData.network == 'livenet' ?
        this.derivationPathService.getDefault() :
        this.derivationPathService.getDefaultTestnet();

    this.sjcl = this.bwcService.getSJCL();
  }

  async openScanner() {
    let address = await this.addressScanner.scanAddress();

    if (address) {
      const parts = address.split('|');
      this.formData.words = parts[1];
      this.formData.network = parts[2];
      this.formData.derivationPath = parts[3];
      this.formData.hasPassphrase = Boolean(parts[4]);
    }
  }

  openFilePicker() {
    this.input.nativeElement.click();
  }

  fileChangeListener($event) {
    this.formData.backupFile = $event.target.files[0];

    const reader: any = new FileReader();
    this.loadFileInProgress = true;
    reader.onloadend = (loadEvent: any) => {
      if (loadEvent.target.readyState == 2) { //DONE  == 2
        this.loadFileInProgress = false;
        this.formData.backupFileBlob = loadEvent.target.result;
      }
    };

    reader.readAsText($event.target.files[0]);
  }


  async importMnemonic() {
    const loader = this.loadingCtrl.create({ content: 'Importing wallet' });
    loader.present();

    const pathData = this.derivationPathService.parse(this.formData.derivationPath);

    if (!pathData) {
      return this.toastCtrl.create({ message: 'Invalid derivation path', cssClass: ToastConfig.CLASS_ERROR });
    }

    const opts: any = {
      account: pathData.account,
      networkName: pathData.networkName,
      derivationStrategy: pathData.derivationStrategy
    };

    let wallet;

    try {
      if (this.formData.words.indexOf('xprv') == 0 || this.formData.words.indexOf('tprv') == 0) {
        wallet = await this.profileService.importExtendedPrivateKey(this.formData.words, opts);
      } else if (this.formData.words.indexOf('xpub') == 0 || this.formData.words.indexOf('tpub') == 0) {
        opts.extendedPublicKey = this.formData.words;
        wallet = await this.profileService.importExtendedPublicKey(opts);
      } else {
        opts.passphrase = this.formData.phrasePassword;
        wallet = await this.mnemonicService.importMnemonic(this.formData.words, opts);
      }

      if (wallet) {
        return this.processCreatedWallet(wallet, loader);
      }

      throw new Error('An unexpected error occurred while importing your wallet.');
    } catch (err) {
      loader.dismiss();

      let errorMsg = 'Failed to import wallet';
      if (err && err.message) {
        errorMsg = err.message
      } else if (typeof err === 'string') {
        errorMsg = err;
      }

      this.toastCtrl.create({
        message: errorMsg,
        cssClass: ToastConfig.CLASS_ERROR
      }).present();
    }
  }

  async importBlob() {
    let decrypted;
    try {
      decrypted = this.sjcl.decrypt(this.formData.filePassword, this.formData.backupFileBlob);
    } catch (e) {

      this.logger.warn(e);
      return this.toastCtrl.create({
        message: 'Could not decrypt file, check your password',
        cssClass: ToastConfig.CLASS_ERROR
      }).present();
    }

    const loader = this.loadingCtrl.create({ content: 'importingWallet' });
    loader.present();

    try {
      const wallet = await this.profileService.importWallet(decrypted, { bwsurl: this.formData.bwsUrl });
      return this.processCreatedWallet(wallet, loader);
    } catch (err) {
      loader.dismiss();
      this.logger.warn(err);
      this.toastCtrl.create({
        message: err,
        cssClass: ToastConfig.CLASS_ERROR
      }).present();
    }
  }

  mnemonicImportAllowed() {
    const { words } = this.formData;

    if (!words) return false;

    if (startsWith('xprv') || startsWith('tprv') || startsWith('xpub') || startsWith('tpuv')) {
      return true;
    } else {
      return !(words.split(/[\u3000\s]+/).length % 3)
    }
  }

  fileImportAllowed() {
    return (
      !this.loadFileInProgress && this.formData.backupFileBlob && this.formData.filePassword
    );
  }

  private async processCreatedWallet(wallet, loader?) {
    await this.walletService.updateRemotePreferences(wallet);
    this.profileService.setBackupFlag(wallet.credentials.walletId);
    if (loader) loader.dismiss();
    this.app.getRootNavs()[0].setRoot('TransactView');
  }

}
