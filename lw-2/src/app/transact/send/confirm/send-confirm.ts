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

  // Core Params
  public address: string;
  public amount: string;
  public description: string;
  public sendMax: boolean;
  public feeLevel: any;
  public allowSpendUnconfirmed: boolean = true; // TODO: Consider removing entirely.

  // Vanity Params -- Not on the blockchain; but we use convenience and usability.
  public recipientType: any; // TODO: Define type
  public toName: string;
  public toEmail: string;
  public toPhoneNumber: string;
  public toColor: string;
  public txp: any; // Transaction proposal

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
