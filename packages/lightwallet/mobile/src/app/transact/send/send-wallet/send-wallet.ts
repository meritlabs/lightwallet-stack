import { Component } from '@angular/core';
import { IonicPage, NavParams, ViewController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'view-send-wallet',
  templateUrl: 'send-wallet.html',
})
export class SendWalletView {
  wallets;
  selectedWallet;

  constructor(private navParams: NavParams, private viewCtrl: ViewController) {}

  async ionViewDidLoad() {
    this.selectedWallet = this.navParams.get('selectedWallet');
    this.wallets = this.navParams.get('availableWallets');
  }

  cancel() {
    this.viewCtrl.dismiss();
  }

  select(wallet) {
    this.viewCtrl.dismiss(wallet);
  }
}
