import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

/**
 * The confirm view is the final step in the transaction sending process 
 * (for sing-signature wallets).
 */
@Component({
  selector: 'confirm-view',
  templateUrl: 'confirm.html',
})
export class ConfirmView {

  public address: string;
  public amount: string;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams
  ) { 

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ConfirmView');
    this.address = this.navParams.data.address;
    this.amount = this.navParams.data.amount;
  }

}
