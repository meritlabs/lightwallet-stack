import { Component, ViewChild } from '@angular/core';
import { Content, IonicPage, LoadingController, NavController, NavParams } from 'ionic-angular';
import * as _ from 'lodash';
import { WalletService } from '@merit/common/services/wallet.service';
import { LoggerService } from '@merit/common/services/logger.service';
import { ConfigService } from '@merit/common/services/config.service';
import { PushNotificationsService } from '@merit/mobile/../../../../../common/services/push-notification.service';
import { PollingNotificationsService } from '@merit/mobile/../../../../../common/services/polling-notification.service';
import { cleanAddress, isAlias } from '@merit/common/utils/addresses';
import { MWCErrors } from '@merit/common/merit-wallet-client/lib/errors';
import { MeritToastController, ToastConfig } from '@merit/common/services/toast.controller.service';
import { SendService } from '@merit/common/services/send.service';

@IonicPage({
  defaultHistory: ['OnboardingView']
})
@Component({
  selector: 'view-alias',
  templateUrl: 'alias.html',
})
export class AliasView {
  unlockState: 'success' | 'fail' | 'aliasFail';
  formData = {
    alias: '',
    aliasValidationError: '',
    aliasCheckInProgress: false
  };

  @ViewChild(Content) content: Content;

  private parentAddress: string;

  constructor(private walletService: WalletService,
              private toastCtrl: MeritToastController,
              private loaderCtrl: LoadingController,
              private navCtrl: NavController,
              private navParams: NavParams,
              private logger: LoggerService,
              private config: ConfigService,
              private pushNotificationService: PushNotificationsService,
              private pollingNotificationService: PollingNotificationsService,
              private sendService: SendService) {
  }

  async ionViewDidLoad() {
    // An unlock code from a friend sharing the link.
    this.parentAddress = this.navParams.get('parentAddress');
  }

  checkAlias() {
    this.formData.aliasCheckInProgress = true;
    this.validateAliasDebounce();
  }

  private validateAliasDebounce = _.debounce(() => {
    this.validateAlias();
  }, 750);

  private async validateAlias() {

    this.formData.alias = cleanAddress(this.formData.alias);
    const input = (this.formData.alias && isAlias(this.formData.alias)) ? this.formData.alias.slice(1) : this.formData.alias;

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
      if (err == MWCErrors.INVALID_REFERRAL) this.unlockState = 'fail';
      this.logger.debug('Could not unlock wallet: ', err);
      this.toastCtrl.create({
        message: err.text || err.message || 'Unknown error',
        cssClass: ToastConfig.CLASS_ERROR
      }).present();
    }

    await loader.dismiss();
  }
}
