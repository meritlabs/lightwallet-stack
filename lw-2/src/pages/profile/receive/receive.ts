import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';

import {ProfileService} from "../../../providers/profile-service";
import {Wallet} from "../../../models/wallet";

@IonicPage()
@Component({
  selector: 'page-receive',
  templateUrl: 'receive.html',
})
export class ReceivePage {

  public protocolHandler: string;
  public address: string;
  public qrAddress: string;

  public wallets:Array<Wallet>;
  public wallet:Wallet;

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
    //this.navCtrl.push(AmountPage, {address: this.address, sending: false});
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
    this.navCtrl.push('CopayersPage', {walletId: this.wallet.id, wallet: this.wallet});
  }

  shareButtonAvailable() {
    return (
      this.wallet
      && this.wallet.isComplete()
      //&& TODO CHECK IF IS NATIVE
    );
  }

}


