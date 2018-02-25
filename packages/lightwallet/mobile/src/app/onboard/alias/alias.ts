import { Component, ViewChild } from '@angular/core';
import { App, Content, IonicPage, LoadingController, NavController } from 'ionic-angular';
import { NavParams } from 'ionic-angular/navigation/nav-params';
import { Errors } from '@merit/mobile/lib/merit-wallet-client/lib/errors';
import { Logger } from '@merit/mobile/app/core/logger';
import { PollingNotificationsService } from '@merit/mobile/app/core/notification/polling-notification.service';
import { PushNotificationsService } from '@merit/mobile/app/core/notification/push-notification.service';
import { ToastConfig } from '@merit/mobile/app/core/toast.config';
import { MeritToastController } from '@merit/mobile/app/core/toast.controller';
import { ConfigService } from '@merit/mobile/app/shared/config.service';
import { WalletService } from '@merit/mobile/app/wallets/wallet.service';
import { SendService } from '@merit/mobile/app/transact/send/send.service';
import * as _ from 'lodash';
import { cleanAddress, isAlias } from '../../../utils/addresses';

// Unlock view for wallet
@IonicPage({
  defaultHistory: ['OnboardingView']
})
@Component({
  selector: 'view-alias',
  templateUrl: 'alias.html',
})
export class AliasView {
  public unlockState: 'success' | 'fail' | 'aliasFail';
  public formData = {
      alias: '',
      aliasValidationError: '',
      aliasCheckInProgress: false
    };

  @ViewChild(Content) content: Content;

  private parentAddress:string;

  constructor(private app: App,
              private walletService: WalletService,
              private toastCtrl: MeritToastController,
              private loaderCtrl: LoadingController,
              private navCtrl: NavController,
              private navParams: NavParams,
              private logger: Logger,
              private config: ConfigService,
              private pushNotificationService: PushNotificationsService,
              private pollingNotificationService: PollingNotificationsService,
              private sendService: SendService
            ) {
  }

  async ionViewDidLoad() {
    // An unlock code from a friend sharing the link.
    this.parentAddress = this.navParams.get('parentAddress');
  }

  checkAlias() {
    this.formData.aliasCheckInProgress = true;
    this.validateAliasDebounce();
  }

  private validateAliasDebounce = _.debounce(() => { this.validateAlias() }, 750);

  private async validateAlias() {

    this.formData.alias = cleanAddress(this.formData.alias);
    const input = (this.formData.alias && isAlias(this.formData.alias))  ? this.formData.alias.slice(1) : this.formData.alias;

    if (!input) {
      this.validateAliasDebounce.cancel();
      this.formData.aliasCheckInProgress = false;
      return this.formData.aliasValidationError = null;
    }

    if (input.length < 3) {
      this.validateAliasDebounce.cancel();
      this.formData.aliasCheckInProgress = false;
      return this.formData.aliasValidationError = 'Alias should contain at least 3 symbols';
    }

    if (!this.sendService.couldBeAlias(input)) {
      this.validateAliasDebounce.cancel();
      this.formData.aliasCheckInProgress = false;
      return this.formData.aliasValidationError = 'Incorrect alias format';
    }

    this.formData.aliasValidationError = null;


    let addressExists = await this.sendService.getValidAddress(input);

    if (addressExists) {
      this.formData.aliasValidationError = 'Alias already in use';
    } else {
      this.formData.aliasValidationError = null;
    }

    this.formData.aliasCheckInProgress = false;
  }

  async createWallet() {
    if (this.formData.aliasValidationError || this.formData.aliasCheckInProgress) {
      return false;
    }

    const alias = (this.formData.alias && isAlias(this.formData.alias)) ? this.formData.alias.slice(1) : this.formData.alias;

    const loader = this.loaderCtrl.create({ content: 'Creating wallet...' });
    await loader.present();

    try {
      const wallet = await this.walletService.createDefaultWallet(this.parentAddress, alias);
      this.logger.info('Created a new default wallet!');

      if (this.config.get().pushNotificationsEnabled) {
        this.logger.info('Subscribing to push notifications for default wallet');
        await this.pushNotificationService.subscribe(wallet);
      } else {
        this.logger.info('Subscribing to long polling for default wallet');
        this.pollingNotificationService.enablePolling(wallet);
      }

      await this.navCtrl.setRoot('BackupView', { mnemonic: wallet.getMnemonic() });
      await this.navCtrl.popToRoot();
    } catch (err) {
      if (err == Errors.INVALID_REFERRAL) this.unlockState = 'fail';
      this.logger.debug('Could not unlock wallet: ', err);
      this.toastCtrl.create({
        message: err.text || err.message || 'Unknown error',
        cssClass: ToastConfig.CLASS_ERROR
      }).present();
    }

    await loader.dismiss();
  }

}
