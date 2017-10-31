import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';

import { ProfileService } from "merit/core/profile.service";
import { Wallet } from "merit/wallets/wallet.model";

@IonicPage()
@Component({
  selector: 'view-receive',
  templateUrl: 'receive.html',
})
export class ReceiveView {

  public protocolHandler: string;
  public address: string;
  public qrAddress: string;

  public wallets;
  public wallet;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private  ModalCtrl:ModalController,
    private profileService:ProfileService
  ) {
    this.protocolHandler = "bitcoin";
    this.address = "1FgGP9dKqtWC1Q9xGhPYVmAeyezeZCFjhf";
    this.updateQrAddress();
  }

  ionViewDidLoad() {
    //do something here
    this.wallets = this.profileService.getWallets();
    this.wallet = this.wallets[0];

  }

  requestSpecificAmount() {
    //this.navCtrl.push(AmountView, {address: this.address, sending: false});
  }

  setAddress() {
    this.address = this.address === "1FgGP9dKqtWC1Q9xGhPYVmAeyezeZCFjhf" ? "1RTes3reeRTs1Q9xGhPYVmQFrdUyCr3EsX" : "1FgGP9dKqtWC1Q9xGhPYVmAeyezeZCFjhf";
    this.updateQrAddress();
  }

  updateQrAddress () {
    this.qrAddress = this.protocolHandler + ":" + this.address;
  }

  selectWallet() {
    let modal = this.ModalCtrl.create('SelectWalletModal', {selectedWallet: this.wallet, availableWallets: this.wallets});
    modal.present();
    modal.onDidDismiss((wallet) => {
      if (wallet) this.wallet = wallet;
    });
  }

  share() {
    //@TODO implement sharing using Ionic Social Sharing
  }

  copyToClipboard(address) {
    // @TODO implement copy to clipboard and notify
  }

  toCopayers() {
    this.navCtrl.push('CopayersView', {walletId: this.wallet.id, wallet: this.wallet});
  }

  shareButtonAvailable() {
    return (
      this.wallet
      && this.wallet.isComplete()
      //&& TODO CHECK IF IS NATIVE
    );
  }

}


