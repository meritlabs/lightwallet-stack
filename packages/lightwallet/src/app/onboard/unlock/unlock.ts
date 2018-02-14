import { Component, ViewChild } from '@angular/core';
import { App, Content, IonicPage, LoadingController, NavController } from 'ionic-angular';
import { NavParams } from 'ionic-angular/navigation/nav-params';
import { Errors } from 'merit/../lib/merit-wallet-client/lib/errors';
import { Logger } from 'merit/core/logger';
import { PollingNotificationsService } from 'merit/core/notification/polling-notification.service';
import { PushNotificationsService } from 'merit/core/notification/push-notification.service';
import { ToastConfig } from 'merit/core/toast.config';
import { MeritToastController } from 'merit/core/toast.controller';
import { EasyReceipt } from 'merit/easy-receive/easy-receipt.model';
import { EasyReceiveService } from 'merit/easy-receive/easy-receive.service';
import { ConfigService } from 'merit/shared/config.service';
import { WalletService } from 'merit/wallets/wallet.service';
import { SendService } from 'merit/transact/send/send.service';
import * as _ from 'lodash';

// Unlock view for wallet
@IonicPage({
  defaultHistory: ['OnboardingView']
})
@Component({
  selector: 'view-unlock',
  templateUrl: 'unlock.html',
})
export class UnlockView {
  public unlockState: 'success' | 'fail' | 'aliasFail';
  public formData = {
      parentAddress: '' ,
      alias: '',
      aliasValidationError: '',
      aliasCheckInProgress: false
    };
  public easyReceipt: EasyReceipt;

  @ViewChild(Content) content: Content;

  constructor(private app: App,
              private walletService: WalletService,
              private toastCtrl: MeritToastController,
              private loaderCtrl: LoadingController,
              private navCtrl: NavController,
              private navParams: NavParams,
              private easyReceiveService: EasyReceiveService,
              private logger: Logger,
              private config: ConfigService,
              private pushNotificationService: PushNotificationsService,
              private pollingNotificationService: PollingNotificationsService,
              private sendService: SendService
            ) {
  }

  async ionViewDidLoad() {
    // An unlock code from a friend sharing the link.
    this.formData.parentAddress = this.navParams.get('unlockCode') || '';

    const receipts = await this.easyReceiveService.getPendingReceipts();
    this.easyReceipt = receipts.pop();
    // The unlock code from a pending easyReceipt takes priority.
    if (this.easyReceipt) this.formData.parentAddress = this.easyReceipt.parentAddress;
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
    if (!this.formData.parentAddress) {
      this.unlockState = 'fail';
      return;
    }

    if (this.formData.aliasValidationError) {
      this.unlockState = 'aliasFail';
      return;
    }

    const loader = this.loaderCtrl.create({ content: 'Creating wallet...' });
    await loader.present();

    try {
      const wallet = await this.walletService.createDefaultWallet(this.formData.parentAddress, this.formData.alias);
      this.logger.info('Created a new default wallet!');

      if (this.config.get().pushNotificationsEnabled) {
        this.logger.info('Subscribing to push notifications for default wallet');
        this.pushNotificationService.subscribe(wallet);
      } else {
        this.logger.info('Subscribing to long polling for default wallet');
        this.pollingNotificationService.enablePolling(wallet);
      }

      this.navCtrl.push('BackupView', {
        mnemonic: wallet!.getMnemonic(),
      });
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

  onInputFocus() {
    setTimeout(() => this.content.scrollToBottom(), 500);
  }

}
