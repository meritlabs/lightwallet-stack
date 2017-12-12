import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ModalController, App  } from 'ionic-angular';

import { ConfigService } from "merit/shared/config.service";
import { BwcService } from "merit/core/bwc.service";
import { ToastConfig } from "merit/core/toast.config";
import { Logger } from "merit/core/logger";
import { ProfileService } from "merit/core/profile.service";
import { WalletService } from "merit/wallets/wallet.service";
import { MeritToastController } from "merit/core/toast.controller";
import { DerivationPathService } from "merit/utilities/mnemonic/derivation-path.service";
import { MnemonicService } from "merit/utilities/mnemonic/mnemonic.service";


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
    filePassword: '',
    network: '',
    hasPassphrase: false
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
    private derivationPathService:DerivationPathService,
    private modalCtrl:ModalController,
    private app:App,
    private mnemonicService:MnemonicService
  ) {

    this.formData.bwsUrl = config.getDefaults().bws.url;
    this.formData.network = config.getDefaults().network.name;
    this.formData.derivationPath =
      this.formData.network == 'livenet' ?
      this.derivationPathService.getDefault() :
      this.derivationPathService.getDefaultTestnet();
      
    this.sjcl = this.bwcService.getSJCL();
  }

  ionViewDidLoad() {
  }

  openScanner() {
    let modal = this.modalCtrl.create('ImportScanView');
    modal.onDidDismiss((data) => {
      if (data) {
        let parts = data.split('|');
        this.formData.words = parts[1];
        this.formData.network = parts[2];
        this.formData.derivationPath = parts[3];
        this.formData.hasPassphrase = parts[4];
      }
    });
    modal.present();
  }



  openFilePicker() {
    this.input.nativeElement.click();
  }

  fileChangeListener($event) {

    this.formData.backupFile = $event.target.files[0];

    let reader:any = new FileReader();
    this.loadFileInProgress = true;
    reader.onloadend = (loadEvent:any) => {
       if (loadEvent.target.readyState == 2) { //DONE  == 2
        this.loadFileInProgress = false;
        this.formData.backupFileBlob = loadEvent.target.result;
       }
    };

    reader.readAsText($event.target.files[0]);
  }


  importMnemonic() {


    let loader = this.loadingCtrl.create({content: 'importingWallet'});
    loader.present();
    let  pathData = this.derivationPathService.parse(this.formData.derivationPath);
    if (!pathData) {
      return this.toastCtrl.create({message: 'Invalid derivation path',  cssClass: ToastConfig.CLASS_ERROR});
    }
    let opts:any = {
      account: pathData.account,
      networkName: pathData.networkName,
      derivationStrategy: pathData.derivationStrategy
    };

    let importCall;
    if (this.formData.words.indexOf('xprv') == 0 || this.formData.words.indexOf('tprv') == 0) {
      importCall = this.profileService.importExtendedPrivateKey(this.formData.words, opts);
    } else if (this.formData.words.indexOf('xpub') == 0 || this.formData.words.indexOf('tpub') == 0) {
      opts.extendedPublicKey = this.formData.words;
      importCall = this.profileService.importExtendedPublicKey(opts);
    } else {
      opts.passphrase = this.formData.phrasePassword;
      importCall = this.mnemonicService.importMnemonic(this.formData.words, opts);
    }

    return importCall.then((wallet) => {
      return this.processCreatedWallet(wallet, loader);
    }).catch((err) => {
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
    });

  }

  importBlob() {

    let decrypted;
    try {

      decrypted = this.sjcl.decrypt(this.formData.filePassword, this.formData.backupFileBlob);

    } catch (e) {

      this.logger.warn(e);
      return this.toastCtrl.create({
        message: "Could not decrypt file, check your password",
        cssClass: ToastConfig.CLASS_ERROR
      }).present();
    }

    let loader = this.loadingCtrl.create({content: 'importingWallet'});
    loader.present();

    this.profileService.importWallet(decrypted, {bwsurl: this.formData.bwsUrl}).then((wallet) => {
        this.processCreatedWallet(wallet, loader);
    }).catch((err) => {
      loader.dismiss();
      this.logger.warn(err);
      this.toastCtrl.create({
        message: err,
        cssClass: ToastConfig.CLASS_ERROR
      }).present();
    });


  }

  private processCreatedWallet(wallet, loader?) {
     console.log('PROCESSING');
    //this.walletService.updateRemotePreferences(wallet, {}).then(() => {
    this.profileService.setBackupFlag(wallet.credentials.walletId);
    if (loader) loader.dismiss();
    this.app.getRootNav().setRoot('TransactView');
    //});
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
