import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'view-send-wallet',
  templateUrl: 'send-wallet.html',
})
export class SendWalletView {

  public wallets;
  public selectedWallet;

  constructor(
    private navParams: NavParams,
    private viewCtrl: ViewController
  ) {}

  async ionViewDidLoad() {
    this.selectedWallet = this.navParams.get('selectedWallet');
    this.wallets = this.navParams.get('availableWallets')
  }

  cancel() {
    this.viewCtrl.dismiss();
  }

  select(wallet) {
    this.viewCtrl.dismiss(wallet);
  }

}
