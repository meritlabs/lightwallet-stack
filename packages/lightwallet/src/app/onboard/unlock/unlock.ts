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
  public unlockState: 'success' | 'fail' | 'addressFail';
  public formData = {
      parentAddress: '' ,
      addressCheckError: '',
      addressCheckInProgress: false
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

  checkAddress() {

    this.formData.addressCheckInProgress = true;
    this.validateAddressDebounce();
  }

  private validateAddressDebounce = _.debounce(() => { this.validateAddress() }, 750);

  private async validateAddress() {


    if (!this.formData.parentAddress) {
      return this.formData.addressCheckError = 'Address cannot be empty';
    } else if (!this.sendService.isAddress(this.formData.parentAddress)) {
      if (!this.sendService.couldBeAlias(this.formData.parentAddress)) {
        return this.formData.addressCheckError = 'Incorrect address or alias format';
      } else {
        let addressExists = await this.sendService.getValidAddress(this.formData.parentAddress);
        if (!addressExists) {
          return this.formData.addressCheckError = 'Alias not found';
        }
      }
    } else {
      let addressExists = await this.sendService.getValidAddress(this.formData.parentAddress);
      if (!addressExists) {
        return this.formData.addressCheckError = 'Address not found';
      }
    }

    this.formData.addressCheckError = null;
    this.formData.addressCheckInProgress = false;
  }

  //
  onInputFocus() {
    setTimeout(() => this.content.scrollToBottom(), 500);
  }

  toAliasView() {
    if (this.formData.parentAddress && !this.formData.addressCheckInProgress && !this.formData.addressCheckError) {
      this.navCtrl.push('AliasView', {parentAddress: this.formData.parentAddress});
    }
  }

}
