import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController  } from 'ionic-angular';

import { ConfigService } from "merit/shared/config.service";
import {BwcService} from "merit/core/bwc.service";
import {ToastConfig} from "merit/core/toast.config";
import {Logger} from "merit/core/logger";
import {ProfileService} from "merit/core/profile.service";
import {WalletService} from "merit/wallets/wallet.service";
import {MeritToastController} from "merit/core/toast.controller";
import {DerivationPathService} from "merit/utilities/mnemonic/derivation-path.service";


@IonicPage({
  defaultHistory: ['OnboardingView']
})
@Component({
  selector: 'view-import',
  templateUrl: 'import.html',
})
export class ImportView {

  //public phraseView = 'ImportPhraseView';
  //public fileView   = 'ImportFileView';
  //public formGroup:FormGroup;

  @ViewChild('fileInput') input:ElementRef;

  public segment = 'phrase';

  public formData = {
    words: '',
    phrasePassword: '',
    derivationPath: '',
    fromHardwareWallet: false,
    testnetEnabled: false,
    bwsUrl: '',
    backupFile: null,
    backupFileBlob:'',
    filePassword: ''
  };

  public loadFileInProgress = false;
  private sjcl;

  constructor(
    private  navCtrl: NavController,
    private bwcService:BwcService,
    private config:ConfigService,
    private toastCtrl:MeritToastController,
    private logger:Logger,
    private loadingCtrl:LoadingController,
    private profileService:ProfileService,
    private walletService:WalletService,
    private derivationPathService:DerivationPathService
  ) {

    this.formData.bwsUrl = config.getDefaults().bws.url;
    this.formData.derivationPath = this.derivationPathService.getDefault();

    this.sjcl = this.bwcService.getSJCL();
  }

  ionViewDidLoad() {
  }

  openScanner() {
    this.navCtrl.push('ImportScanView');
  }

  openFilePicker() {
    this.input.nativeElement.click();
  }

  fileChangeListener($event) {

    this.formData.backupFile = $event.target.files[0];

    let reader:any = new FileReader();
    this.loadFileInProgress = true;
    reader.onloadend = (loadEvent:any) => {
      if (loadEvent.target.readyState == FileReader.DONE) {
        this.loadFileInProgress = false;
        this.formData.backupFileBlob = loadEvent.target.result;
      }
    };

    reader.readAsDataURL($event.target.files[0]);
  }


  importMnemonic() {

    let  pathData = this.derivationPathService.parse(this.formData.derivationPath);
    if (!pathData) {
      return this.toastCtrl.create({message: 'Invalid derivation path',  cssClass: ToastConfig.CLASS_ERROR});
    }
    let opts:any = {
      account: pathData.account,
      networkNAme: pathData.networkName,
      derivationStrategy: pathData.derivationStrategy
    };

    let importCall;
    if (this.formData.words.indexOf('xprv') == 0 || this.formData.words.indexOf('tprv') == 0) {
      importCall = this.profileService.importExtendedPrivateKey(this.formData.words, opts);
    } else if (this.formData.words.indexOf('xpub') == 0 || this.formData.words.indexOf('tpub') == 0) {
      importCall = this.profileService.importExtendedPublicKey(this.formData.words, opts);
    } else {
      opts.passphrase = this.formData.phrasePassword;
      importCall = this.profileService.importMnemonic(this.formData.words, opts);
    }

    importCall.then((wallet) => {
      this.processCreatedWallet(wallet);
    });

  }

  importBlob() {

    let decrypted;
    try {
      decrypted = this.sjcl.decrypt(this.formData.filePassword, this.formData.backupFileBlob);

      let loader = this.loadingCtrl.create({content: 'importingWallet'});
      loader.present();

      this.profileService.importWallet(decrypted, {bwsurl: this.formData.bwsUrl}).then((wallet) => {
        this.processCreatedWallet(wallet, loader);
      });

    } catch (e) {
      this.logger.warn(e);
      this.toastCtrl.create({
        message: "Could not decrypt file, check tour password",
        cssClass: ToastConfig.CLASS_ERROR
      }).present();
    }
  }

  private processCreatedWallet(wallet, loader?) {
    this.walletService.updateRemotePreferences(wallet, {}).then(() => {
      this.profileService.setBackupFlag(wallet.credentials.walletId);
      if (loader) loader.dismiss();
      this.navCtrl.push('TransactView');
    });
  }

  setDerivationPath() {
    this.formData.derivationPath = this.formData.testnetEnabled ? this.derivationPathService.getDefaultTestnet() : this.derivationPathService.getDefault();
  }

  mnemonicImportAllowed() {

    let checkWords = (words) => {

      let beginsWith = (str) => {
        return (this.formData.words.indexOf(str) == 0);
      };

      if (beginsWith('xprv') || beginsWith('tprv') || beginsWith('xpub') || beginsWith('tpuv')) {
        return true;
      } else {
        return !(this.formData.words.split(/[\u3000\s]+/).length % 3)
      }

    };

    return (
      this.formData.words && checkWords(this.formData.words)
    )
  }

  fileImportAllowed() {
    return (
      !this.loadFileInProgress && this.formData.backupFileBlob && this.formData.filePassword
    );
  }

}
