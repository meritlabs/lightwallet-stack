import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';


@IonicPage({
  segment: 'wallet/:walletId',
  defaultHistory: ['ProfileView']
})
@Component({
  selector: 'view-wallet',
  templateUrl: 'wallet.html',
})
export class WalletView {

  public wallet:any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams
  ) {
      this.wallet = this.navParams.get('wallet');
  }

  ionViewWillLeave() {
    this.wallet.balanceHidePaused = false;
  }

  ionViewDidLoad() {
    console.log(this.wallet);
    //do something here
  }


  goToBackup() {
    console.log('not implemented yet');
  }

}
