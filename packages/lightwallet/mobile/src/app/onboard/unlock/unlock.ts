import { Component, ViewChild } from '@angular/core';
import { Content, IonicPage, NavController, NavParams } from 'ionic-angular';
import * as _ from 'lodash';
import { EasyReceipt } from '@merit/common/models/easy-receipt';
import { EasyReceiveService } from '@merit/common/providers/easy-receive';
import { SendService } from '@merit/mobile/app/transact/send/send.service';
import { AddressScannerService } from '@merit/mobile/app/utilities/import/address-scanner.service';
import { cleanAddress, isAlias } from '@merit/common/utils/addresses';

@IonicPage({
  defaultHistory: ['OnboardingView']
})
@Component({
  selector: 'view-unlock',
  templateUrl: 'unlock.html',
})
export class UnlockView {
  unlockState: 'success' | 'fail' | 'addressFail';
  formData = {
    parentAddress: '',
    addressCheckError: '',
    addressCheckInProgress: false
  };
  easyReceipt: EasyReceipt;
  parsedAddress: '';

  get canContinue(): boolean {
    return Boolean(this.formData.parentAddress) && !this.formData.addressCheckInProgress && !this.formData.addressCheckError;
  }

  get shouldShowQRButton(): boolean {
    return !Boolean(this.formData.parentAddress) && !this.formData.addressCheckInProgress && !this.formData.addressCheckError;
  }

  @ViewChild(Content) content: Content;

  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              private easyReceiveService: EasyReceiveService,
              private sendService: SendService,
              private addressScanner: AddressScannerService) {
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
    this.formData.parentAddress = cleanAddress(this.formData.parentAddress);

    let input = (this.formData.parentAddress && isAlias(this.formData.parentAddress)) ? this.formData.parentAddress.slice(1) : this.formData.parentAddress;
    if (!input) {
      this.formData.addressCheckInProgress = false;
      return this.formData.addressCheckError = 'Address cannot be empty';
    } else if (!this.sendService.isAddress(input) && !this.sendService.couldBeAlias(input)) {
      this.formData.addressCheckInProgress = false;
      return this.formData.addressCheckError = 'Incorrect address or alias format';
    } else {
      let addressInfo = await this.sendService.getAddressInfo(input);
      if (!addressInfo || !addressInfo.isValid || !addressInfo.isBeaconed || !addressInfo.isConfirmed) {
        this.formData.addressCheckInProgress = false;
        return this.formData.addressCheckError = 'Address not found';
      } else {
        this.formData.addressCheckError = null;
        this.formData.addressCheckInProgress = false;
        return this.parsedAddress = addressInfo.address;
      }
    }
  }

  toAliasView() {
    if (this.formData.parentAddress && !this.formData.addressCheckInProgress && !this.formData.addressCheckError) {
      this.navCtrl.push('AliasView', { parentAddress: this.parsedAddress });
    }
  }

  async openQrScanner() {
    let address = await this.addressScanner.scanAddress();
    if (address) {
      if (address.indexOf('merit:') == 0) address = address.slice(6);
      this.formData.parentAddress = address;
      this.checkAddress();
    }
  }

}
