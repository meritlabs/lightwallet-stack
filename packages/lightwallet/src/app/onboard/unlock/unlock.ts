import { Component, ViewChild } from '@angular/core';
import { Content, IonicPage, NavController } from 'ionic-angular';
import { NavParams } from 'ionic-angular/navigation/nav-params';
import { EasyReceipt } from 'merit/easy-receive/easy-receipt.model';
import { EasyReceiveService } from 'merit/easy-receive/easy-receive.service';
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
    parentAddress: '',
    addressCheckError: '',
    addressCheckInProgress: false
  };
  public easyReceipt: EasyReceipt;

  @ViewChild(Content) content: Content;

  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              private easyReceiveService: EasyReceiveService,
              private sendService: SendService) {
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

  private validateAddressDebounce = _.debounce(() => {
    this.validateAddress();
  }, 750);

  private async validateAddress() {
    if (!this.formData.parentAddress) {
      return this.formData.addressCheckError = 'Address cannot be empty';
    } else if (!this.sendService.isAddress(this.formData.parentAddress) && !this.sendService.couldBeAlias(this.formData.parentAddress)) {
      return this.formData.addressCheckError = 'Incorrect address or alias format';
    } else {
      if (!await this.sendService.getValidAddress(this.formData.parentAddress)) {
        return this.formData.addressCheckError = 'Address not found';
      }
    }

    this.formData.addressCheckError = null;
    this.formData.addressCheckInProgress = false;
  }

  onInputFocus() {
    setTimeout(() => this.content.scrollToBottom(), 500);
  }

  toAliasView() {
    if (this.formData.parentAddress && !this.formData.addressCheckInProgress && !this.formData.addressCheckError) {
      this.navCtrl.push('AliasView', { parentAddress: this.formData.parentAddress });
    }
  }

}
