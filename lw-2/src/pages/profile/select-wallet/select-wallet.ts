import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import {Wallet} from "../../../models/wallet";
import {ProfileProvider} from "../../../providers/profile";

@IonicPage()
@Component({
  selector: 'page-select-wallet',
  templateUrl: 'select-wallet.html',
})
export class SelectWalletModal {

  public wallets:Array<Wallet>;
  public selectedWallet:Wallet;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private viewCtrl: ViewController,
    private profileProvider:ProfileProvider,
  ) {
      this.wallets = this.profileProvider.getWallets();
      console.log(JSON.stringify(this.wallets));
      this.selectedWallet = this.navParams.get('selectedWallet');
  }

  ionViewDidLoad() {
    //do something here
  }

  cancel() {
    this.viewCtrl.dismiss();
  }

  select(wallet) {
    this.viewCtrl.dismiss(wallet);
  }

}
