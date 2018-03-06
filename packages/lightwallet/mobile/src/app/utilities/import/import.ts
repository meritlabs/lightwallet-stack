import { Component, ElementRef, ViewChild } from '@angular/core';
import { App, IonicPage, Loading, LoadingController } from 'ionic-angular';
import { startsWith } from 'lodash';
import { ENV } from '@app/env';
import { MWCService } from '@merit/common/services/mwc.service';
import { LoggerService } from '@merit/common/services/logger.service';
import { ProfileService } from '@merit/common/services/profile.service';
import { MnemonicService } from '@merit/common/services/mnemonic.service';
import { DerivationPath } from '@merit/common/utils/derivation-path';
import { MeritWalletClient } from '@merit/common/merit-wallet-client';
import { MeritToastController, ToastConfig } from '@merit/common/services/toast.controller.service';
import { AddressScannerService } from '@merit/mobile/app/utilities/import/address-scanner.service';
import { PushNotificationsService } from '@merit/common/services/push-notification.service';

@IonicPage({
  defaultHistory: ['OnboardingView']
})
@Component({
  selector: 'view-import',
  templateUrl: 'import.html',
})
export class ImportView {
  @ViewChild('fileInput') input: ElementRef;

  segment = 'phrase';
  formData = {
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

  loadFileInProgress = false;
  private sjcl;

  constructor(private bwcService: MWCService,
              private toastCtrl: MeritToastController,
              private logger: LoggerService,
              private loadingCtrl: LoadingController,
              private profileService: ProfileService,
              private app: App,
              private mnemonicService: MnemonicService,
              private addressScanner: AddressScannerService,
              private pushNotificationsService: PushNotificationsService) {

    this.formData.bwsUrl = ENV.mwsUrl;
    this.formData.network = ENV.network;
    this.formData.derivationPath =
      this.formData.network == 'livenet' ?
        DerivationPath.getDefault() :
        DerivationPath.getDefaultTestnet();

    this.sjcl = this.bwcService.getSJCL();
  }

  async openScanner() {
    const address = await this.addressScanner.scanAddress();

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

    try {
      const pathData = DerivationPath.parse(this.formData.derivationPath);
      if (!pathData) {
        throw new Error('Invalid derivation path');
      }

      const opts: any = {
        account: pathData.account,
        networkName: pathData.networkName,
        derivationStrategy: pathData.derivationStrategy
      };

      let wallet;

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
        errorMsg = err.message;
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
    const words = this.formData.words ? this.formData.words.replace(/\s\s+/g, ' ').trim() : '';

    if (!words) return false;

    if (startsWith('xprv') || startsWith('tprv') || startsWith('xpub') || startsWith('tpuv')) {
      return true;
    } else {
      return !(words.split(/[\u3000\s]+/).length % 3);
    }
  }

  fileImportAllowed() {
    return (
      !this.loadFileInProgress && this.formData.backupFileBlob && this.formData.filePassword
    );
  }

  private async processCreatedWallet(wallet: MeritWalletClient, loader?: Loading) {
    try {
      this.profileService.setBackupFlag(wallet.credentials.walletId);
      this.pushNotificationsService.subscribe(wallet);
      this.app.getRootNavs()[0].setRoot('TransactView');
    } catch (e) {
      throw e;
    } finally {
      if (loader) loader.dismiss();
    }
  }
}
