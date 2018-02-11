import { Component } from '@angular/core';
import { IonicPage, LoadingController, ModalController, NavController, NavParams, AlertController } from 'ionic-angular';

import * as _ from 'lodash';
import { Logger } from 'merit/core/logger';
import { PollingNotificationsService } from 'merit/core/notification/polling-notification.service';

import { PushNotificationsService } from 'merit/core/notification/push-notification.service';
import { ToastConfig } from 'merit/core/toast.config';
import { MeritToastController } from 'merit/core/toast.controller';
import { ConfigService } from 'merit/shared/config.service';
import { WalletService } from 'merit/wallets/wallet.service';
import { SendService } from 'merit/transact/send/send.service';

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
    alias: '', 
    aliasValidationError: '',
    aliasCheckInProgress: false,   
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
              private pollingNotificationService: PollingNotificationsService,
              private alertCtrl: AlertController,
              private sendService: SendService
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
    return (
      this.formData.parentAddress
      && this.formData.walletName
      && !this.formData.aliasCheckInProgress 
      && !this.formData.aliasValidationError
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

  showAliasTooltip() {
    return this.showTooltip('Add an alias',
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. ');
  }
  
  private showTooltip(title, message) {
    return this.alertCtrl.create({
      title, message,
      buttons: ['Got it']
    }).present();
  }

  checkAlias() {

    if (!this.formData.alias) {
      this.validateAliasDebounce.cancel();
      this.formData.aliasCheckInProgress = false;
      return this.formData.aliasValidationError = null;
    }

    if (this.formData.alias.length < 4) {
      this.validateAliasDebounce.cancel();
      this.formData.aliasCheckInProgress = false;
      return this.formData.aliasValidationError = 'Alias should contain at least 4 symbols';
    }

    if (!this.sendService.couldBeAlias(this.formData.alias)) {
      this.validateAliasDebounce.cancel();
      this.formData.aliasCheckInProgress = false;
      return this.formData.aliasValidationError = 'Incorrect alias format';
    }

    this.formData.aliasValidationError = null;

    this.formData.aliasCheckInProgress = true;
    this.validateAliasDebounce();
    
  }

  private validateAliasDebounce = _.debounce(() => { this.validateAlias() }, 750);

  private async validateAlias() {

    let addressExists = await this.sendService.getValidAddress(this.formData.alias);

    if (addressExists) {
      this.formData.aliasValidationError = 'Alias already in use';
    } else {
      this.formData.aliasValidationError = null;
    }

    this.formData.aliasCheckInProgress = false;
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
      alias: this.formData.alias,
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
        console.log(e);
        this.logger.error(e);
      }

      // We should callback to the wallets list page to let it know that there is a new wallet
      // and that it should updat it's list.
      const callback = this.navParams.get('updateWalletListCB');
      await loader.dismiss();
      await callback();
      return this.navCtrl.pop();
    } catch (err) {
      console.log(err);
      this.logger.error(err);
      await loader.dismiss();
      await this.toastCtrl.create({
        message: err.text || 'Error occured when creating wallet',
        cssClass: ToastConfig.CLASS_ERROR
      }).present();
    }
  }
}
