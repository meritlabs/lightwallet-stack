import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {Wallet} from "../../../../models/wallet";


@IonicPage({
  segment: 'receive/:walletId',
  defaultHistory: ['ReceiveView']
})
@Component({
  selector: 'page-copayers',
  templateUrl: 'copayers.html',
})
export class CopayersView {

  wallet:Wallet;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams
  ) {

    this.wallet = this.navParams.get('wallet');
  }

  copyToClipboard(address) {
    // @TODO implement copy to clipboard and notify
  }

  ionViewDidLoad() {
    //do something here
  }

  cancelInvitation() {
    //showDeletePopup -> show confirm popup and delete wallet
  }

  shareButtonAvailable() {
    return (
      this.wallet
      && this.wallet.secret
      //&& TODO CHECK IF IS NATIVE
    );
  }

  share() {
    // todo implement
  }

}
