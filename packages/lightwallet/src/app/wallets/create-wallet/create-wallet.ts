import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ModalController } from 'ionic-angular';
import { ConfigService } from "merit/shared/config.service";
import { WalletService } from "merit/wallets/wallet.service";
import { MeritToastController } from "merit/core/toast.controller";
import { ToastConfig } from "merit/core/toast.config";
import { Logger } from 'merit/core/logger';

import * as _ from "lodash";
import * as Promise from 'bluebird';
import { PushNotificationsService } from 'merit/core/notification/push-notification.service';
import { PollingNotificationsService } from 'merit/core/notification/polling-notification.service';
import { MeritWalletClient } from 'src/lib/merit-wallet-client';




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
    parentAddress: '',
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
    private logger: Logger,
    private pushNotificationService: PushNotificationsService,
    private pollingNotificationService: PollingNotificationsService
  ) {
    this.formData.bwsurl = config.getDefaults().bws.url;
    this.defaultBwsUrl = config.getDefaults().bws.url;
  }

  ionViewDidEnter() {
    let parentAddress = this.navParams.get('parentAddress');
    if (!_.isNil(parentAddress)) {
      this.formData.parentAddress = parentAddress;
    }
  }

  isCreationEnabled() {
    return true;

    return (
      this.formData.parentAddress
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

  createWallet(): Promise<any> {

    if (this.formData.password != this.formData.repeatPassword) {
      this.toastCtrl.create({
        message: "Passwords don't match",
        cssClass: ToastConfig.CLASS_ERROR
      }).present();
    }

    let opts = {
      name: this.formData.walletName,
      parentAddress: this.formData.parentAddress,
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

    return this.walletService.createWallet(opts).then((wallet: MeritWalletClient) => {
      // Subscribe to push notifications or to long-polling for this wallet.
      if (this.config.get().pushNotificationsEnabled) {
        this.logger.info("Subscribing to push notifications for default wallet");
        this.pushNotificationService.subscribe(wallet);
      } else {
        this.logger.info("Subscribing to long polling for default wallet");
        this.pollingNotificationService.enablePolling(wallet);
      }

      let promises: Promise<any>[] = [];
      if (this.formData.hideBalance) {
        promises.push(this.walletService.setHiddenBalanceOption(wallet.id, this.formData.hideBalance));
      }

      if (this.formData.password) {
        promises.push(this.walletService.encrypt(wallet, this.formData.password));
      }
      if (this.formData.color) {
        let colorOpts = { colorFor: {} };
        colorOpts.colorFor[wallet.id] = this.formData.color;
        promises.push(this.config.set(colorOpts));
      }

      return Promise.join(promises).catch((err) => {
        this.logger.error(err);
      }).finally(() => {
        // We should callback to the wallets list page to let it know that there is a new wallet
        // and that it should updat it's list.
        const callback = this.navParams.get("updateWalletListCB");
        return loader.dismiss().then(() => {
          return callback().then(() => {
            this.navCtrl.pop();
          });
        });
      });
    }).catch((err) => {
      loader.dismiss();
      this.logger.error(err);
      this.toastCtrl.create({
        message: err.text || 'Error occured when creating wallet',
        cssClass: ToastConfig.CLASS_ERROR
      }).present();
    });

  }


}
