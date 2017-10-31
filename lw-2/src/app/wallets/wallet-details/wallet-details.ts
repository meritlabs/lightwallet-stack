import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';


@IonicPage({
  segment: 'wallet/:walletId',
  defaultHistory: ['WalletsView']
})
@Component({
  selector: 'view-wallet',
  templateUrl: 'wallet-details.html',
})
export class WalletDetailsView {

  public wallet:any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams
  ) {
    this.wallet = this.navParams.get('wallet');
    console.log("Inside the wallet-details view.");
    console.log(this.wallet);
  }

  ionViewWillLeave() {
    this.wallet.balanceHidePaused = false;
  }

  ionViewDidLoad() {
    console.log("Wallet-Detail View Did Load.");
    //profileService.getWallet();
    console.log(this.wallet);
    //do something here
  }


  goToBackup() {
    console.log('not implemented yet');
  }

}
