import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { WalletService } from '@merit/common/services/wallet.service';
import { ToastControllerService, IMeritToastConfig } from '@merit/common/services/toast-controller.service';
import { DisplayWallet } from '../../../../../common/models/display-wallet';

@IonicPage()
@Component({
  selector: 'view-set-wallet-password',
  templateUrl: 'set-wallet-password.html',
})
export class SetWalletPasswordView {

  wallet: DisplayWallet;

  isWalletEncrypted: boolean;

  formData = {
    password: '',
    repeatPassword: '',
    currentPassword: ''
  };

  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              private toastCtrl: ToastControllerService,
              private walletService: WalletService) {
    this.wallet = navParams.get('wallet');
    this.isWalletEncrypted = this.walletService.isWalletEncrypted(this.wallet.client);
  }

  async removePassword() {

    try {
      await this.walletService.decryptWallet(this.wallet.client, this.formData.currentPassword);
      this.navCtrl.pop();
    } catch (err) {
      return this.toastCtrl.error('Incorrect current password');
    }

  }

  async setPassword() {

    if (this.formData.password != this.formData.repeatPassword) {
      return this.toastCtrl.error('Passwords don\'t match');
    }


    const encrypt = async () => {
      try {
        await this.walletService.encryptWallet(this.wallet.client, this.formData.password);
        this.navCtrl.pop();
      } catch (err) {
        return this.toastCtrl.error(err);
      }
    };


    if (this.isWalletEncrypted) {
      try {
        await this.walletService.decryptWallet(this.wallet.client, this.formData.currentPassword);
        return encrypt();
      } catch (err) {
        return this.toastCtrl.error('Incorrect current password');
      }
    } else {
      return encrypt();
    }

  }

  saveEnabled() {
    return (
      this.formData.password
      && (this.isWalletEncrypted ? this.formData.currentPassword : true)
    );
  }


}
