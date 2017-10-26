import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { ProfileService } from "@app/core/profile.service";
import { Wallet } from "@app/wallets/wallet.model";

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
    private profileService:ProfileService,
  ) {
      this.wallets = this.profileService.getWallets();
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
