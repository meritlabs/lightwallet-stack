import { Component, ElementRef, ViewChild } from '@angular/core';
import { App, IonicPage, Loading, LoadingController } from 'ionic-angular';
import { startsWith } from 'lodash';
import { ENV } from '@app/env';
import { MWCService } from '@merit/common/services/mwc.service';
import { LoggerService } from '@merit/common/services/logger.service';
import { WalletService } from '@merit/common/services/wallet.service';
import { MnemonicService } from '@merit/common/services/mnemonic.service';
import { DerivationPath } from '@merit/common/utils/derivation-path';
import { MeritWalletClient } from '@merit/common/merit-wallet-client';
import { ToastControllerService, IMeritToastConfig } from '@merit/common/services/toast-controller.service';
import { AddressScannerService } from '@merit/mobile/app/utilities/import/address-scanner.service';
import { PushNotificationsService } from '@merit/common/services/push-notification.service';
import { IRootAppState } from '@merit/common/reducers';
import { Store } from '@ngrx/store';
import { AddWalletAction } from '@merit/common/reducers/wallets.reducer';
import { createDisplayWallet } from '@merit/common/models/display-wallet';
import { UpdateAppAction } from '@merit/common/reducers/app.reducer';
import { InviteRequestsService } from '@merit/common/services/invite-request.service';
import { TxFormatService } from '@merit/common/services/tx-format.service';
import { PersistenceService2 } from '@merit/common/services/persistence2.service';

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
    derivationPath: '',
    fromHardwareWallet: false,
    testnetEnabled: false,
    backupFile: null,
    backupFileBlob: '',
    filePassword: '',
    network: '',
    hasPassphrase: false
  };

  loadFileInProgress = false;
  private sjcl;

  constructor(
    private mwcService: MWCService,
    private toastCtrl: ToastControllerService,
    private logger: LoggerService,
    private loadingCtrl: LoadingController,
    private app: App,
    private mnemonicService: MnemonicService,
    private addressScanner: AddressScannerService,
    private pushNotificationsService: PushNotificationsService,
    private walletService: WalletService,
    private store: Store<IRootAppState>,
    private inviteRequestsService: InviteRequestsService,
    private txFormatService: TxFormatService,
    private persistenceService2: PersistenceService2,
  ) {
    this.formData.network = ENV.network;
    this.formData.derivationPath =
      this.formData.network == 'livenet' ?
        DerivationPath.getDefault() :
        DerivationPath.getDefaultTestnet();

    this.sjcl = this.mwcService.getSJCL();
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
        wallet = await this.walletService.importExtendedPrivateKey(this.formData.words, opts);
      } else if (this.formData.words.indexOf('xpub') == 0 || this.formData.words.indexOf('tpub') == 0) {
        opts.extendedPublicKey = this.formData.words;
        wallet = await this.walletService.importExtendedPublicKey(opts);
      } else {
        let words = this.formData.words.replace(/\s\s+/g, ' ').trim();
        wallet = await this.mnemonicService.importMnemonic(words, opts);
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

      this.toastCtrl.error(errorMsg);
    }
  }

  async importBlob() {
    let decrypted;
    try {
      decrypted = this.sjcl.decrypt(this.formData.filePassword, this.formData.backupFileBlob);
    } catch (e) {

      this.logger.warn(e);
      return this.toastCtrl.error('Could not decrypt file, check your password');
    }

    const loader = this.loadingCtrl.create({ content: 'importingWallet' });
    loader.present();

    try {
      const wallet = await this.walletService.importWallet(decrypted, { bwsurl: ENV.mwsUrl });
      return this.processCreatedWallet(wallet, loader);
    } catch (err) {
      loader.dismiss();
      this.logger.warn(err);
      this.toastCtrl.error(err);
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
      this.pushNotificationsService.subscribe(wallet);

      this.store.dispatch(
        new AddWalletAction(
          await createDisplayWallet(wallet, this.walletService, this.inviteRequestsService, this.txFormatService, this.persistenceService2),
        ),
      );

      // update state so we're allowed to access the dashboard, in case this is done via onboarding import
      this.store.dispatch(new UpdateAppAction({
        loading: false,
        authorized: true,
      }));

      this.app.getRootNavs()[0].setRoot('TransactView');
    } catch (e) {
      throw e;
    } finally {
      if (loader) loader.dismiss();
    }
  }
}
