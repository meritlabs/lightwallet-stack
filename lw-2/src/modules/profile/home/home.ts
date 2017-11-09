import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';
//import {Wallet} from "../../../models/wallet";
//import {ProfileService} from "../../../providers/profile-service";


@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {

  private totalAmount = 0;
  public totalAmountFormatted = '0 bits';

  //public wallets:Array<Wallet> = [];
  public proposals = [];
  public transactions = [];

  //private navCtrl:NavController;

  constructor(
    public navParams: NavParams,
    private navCtrl:NavController,
    private app:App,
    //private profileService:ProfileService
  ) {
    //this.navCtrl = app.getRootNavs()[0];
  }

  doRefresh(refresher) {
    refresher.complete();
  }

  ionViewDidLoad() {
    //do something here
    //this.wallets = this.profileService.getWallets();
  }

  openWallet(wallet) {
    if (!wallet.isComplete) {
      this.navCtrl.push('CopayersPage')
    } else {
      this.navCtrl.push('WalletPage', {walletId: wallet.id, wallet: wallet});
    }
  }

  toAddWallet() {
    this.navCtrl.push('CreateWalletPage');
  }

  toImportWallet() {
    this.navCtrl.push('ImportPage');
  }


}
