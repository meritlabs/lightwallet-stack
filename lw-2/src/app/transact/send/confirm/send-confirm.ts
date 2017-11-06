import { Component } from '@angular/core';
import { NavController, NavParams, IonicPage } from 'ionic-angular';

/**
 * The confirm view is the final step in the transaction sending process 
 * (for single-signature wallets).
 */
@IonicPage()
@Component({
  selector: 'send-confirm-view',
  templateUrl: 'send-confirm.html',
})
export class SendConfirmView {

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
