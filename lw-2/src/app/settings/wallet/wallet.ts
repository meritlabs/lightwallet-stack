import { Component } from '@angular/core';
import { IonicComponent, NavController, NavParams } from 'ionic-angular';


@IonicComponent({
  segment: 'wallet/:walletId',
  defaultHistory: ['ProfileComponent']
})
@Component({
  selector: 'component-wallet',
  templateUrl: 'wallet.html',
})
export class WalletComponent {

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
