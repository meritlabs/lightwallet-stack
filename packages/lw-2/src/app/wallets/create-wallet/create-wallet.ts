import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ModalController } from 'ionic-angular';
import { ConfigService } from "merit/shared/config.service";
import { WalletService } from "merit/wallets/wallet.service";
import { MeritToastController } from "merit/core/toast.controller";
import { ToastConfig } from "merit/core/toast.config";
import { Logger } from 'merit/core/logger';

import * as _ from "lodash";
import * as Promise from 'bluebird';




@IonicPage({
  defaultHistory: ['WalletsView']
})
@Component({
  selector: 'view-create-wallet',
  templateUrl: 'create-wallet.html',
})
export class CreateWalletView {

  public formData = {
    walletName: '',
    unlockCode: '',
    bwsurl: '',
    recoveryPhrase: '',
    password: '',
    repeatPassword: '',
    color: '',
    hideBalance: false
  }

  public defaultBwsUrl: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private config: ConfigService,
    private walletService: WalletService,
    private loadCtrl: LoadingController,
    private toastCtrl: MeritToastController,
    private modalCtrl: ModalController,
    private logger: Logger
  ) {
    this.formData.bwsurl = config.getDefaults().bws.url;
    this.defaultBwsUrl = config.getDefaults().bws.url;
  }

  ionViewDidEnter() {
    let unlockCode = this.navParams.get('unlockCode');
    if (!_.isNil(unlockCode)) {
      this.formData.unlockCode = unlockCode;
    }
  }

  isCreationEnabled() {
    return (
      this.formData.unlockCode
      && this.formData.walletName
    );
  }

  selectColor() {
    let modal = this.modalCtrl.create('SelectColorView', { color: this.formData.color });
    modal.onDidDismiss((color) => {
      if (color) {
        this.formData.color = color;
      }
    });
    modal.present();
  }

  async createWallet() {

    if (this.formData.password != this.formData.repeatPassword) {
      return this.toastCtrl.create({
        message: "Passwords don't match",
        cssClass: ToastConfig.CLASS_ERROR
      }).present();
    }

    let opts = {
      name: this.formData.walletName,
      unlockCode: this.formData.unlockCode,
      bwsurl: this.formData.bwsurl,
      mnemonic: this.formData.recoveryPhrase,
      networkName: this.config.getDefaults().network.name,
      m: 1, //todo temp!
      n: 1 //todo temp!
    };

    let loader = this.loadCtrl.create({
      content: 'Creating wallet'
    });
    loader.present();


    try {
      let wallet = await this.walletService.createWallet(opts);
    } catch (err) {
      loader.dismiss();
      this.logger.error(err);
      this.toastCtrl.create({
        message: err.text || 'Error occured when creating wallet',
        cssClass: ToastConfig.CLASS_ERROR
      }).present();
    }

    try {
      if (this.formData.hideBalance) await this.walletService.setHiddenBalanceOption(wallet.id, this.formData.hideBalance);
      if (this.formData.password) await this.walletService.encrypt(wallet, this.formData.password);
      if (this.formData.color) {
        let colorOpts = { colorFor: {} };
        colorOpts.colorFor[wallet.id] = this.formData.color;
        await this.config.set(colorOpts);
      }
      // We should callback to the wallets list page to let it know that there is a new wallet
      // and that it should updat it's list.
    } catch (err) {
      this.logger.error(err);
    }

    let callback = this.navParams.get("updateWalletListCB");
    return loader.dismiss().then(() => {
      return callback().then(() => {
        this.navCtrl.pop();
      });
    });


  }


}

