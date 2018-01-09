import { Component } from '@angular/core';
import { IonicPage, LoadingController, ModalController, NavController, NavParams } from 'ionic-angular';

import * as _ from 'lodash';
import { Logger } from 'merit/core/logger';
import { PollingNotificationsService } from 'merit/core/notification/polling-notification.service';

import { PushNotificationsService } from 'merit/core/notification/push-notification.service';
import { ToastConfig } from 'merit/core/toast.config';
import { MeritToastController } from 'merit/core/toast.controller';
import { ConfigService } from 'merit/shared/config.service';
import { WalletService } from 'merit/wallets/wallet.service';


@IonicPage({
  defaultHistory: ['WalletsView']
})
@Component({
  selector: 'view-create-wallet',
  templateUrl: 'create-wallet.html',
})
export class CreateWalletView {

  formData = {
    walletName: '',
    parentAddress: '',
    bwsurl: '',
    recoveryPhrase: '',
    password: '',
    repeatPassword: '',
    color: '',
    hideBalance: false
  };

  defaultBwsUrl: string;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private config: ConfigService,
              private walletService: WalletService,
              private loadCtrl: LoadingController,
              private toastCtrl: MeritToastController,
              private modalCtrl: ModalController,
              private logger: Logger,
              private pushNotificationService: PushNotificationsService,
              private pollingNotificationService: PollingNotificationsService) {
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

  async createWallet() {

    if (this.formData.password != this.formData.repeatPassword) {
      return this.toastCtrl.create({
        message: `Passwords don't match`,
        cssClass: ToastConfig.CLASS_ERROR
      }).present();
    }

    const opts = {
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

    await loader.present();

    try {
      const wallet = await this.walletService.createWallet(opts);
      // Subscribe to push notifications or to long-polling for this wallet.
      if (this.config.get().pushNotificationsEnabled) {
        this.logger.info('Subscribing to push notifications for default wallet');
        this.pushNotificationService.subscribe(wallet);
      } else {
        this.logger.info('Subscribing to long polling for default wallet');
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
        const colorOpts = {
          colorFor: {
            [wallet.id]: this.formData.color
          }
        };
        promises.push(this.config.set(colorOpts));
      }

      try {
        await Promise.all(promises);
      } catch (e) {
        this.logger.error(e);
      }

      // We should callback to the wallets list page to let it know that there is a new wallet
      // and that it should updat it's list.
      const callback = this.navParams.get('updateWalletListCB');
      await loader.dismiss();
      await callback();
      return this.navCtrl.pop();
    } catch (err) {
      this.logger.error(err);
      await loader.dismiss();
      await this.toastCtrl.create({
        message: err.text || 'Error occured when creating wallet',
        cssClass: ToastConfig.CLASS_ERROR
      }).present();
    }

  }


}
