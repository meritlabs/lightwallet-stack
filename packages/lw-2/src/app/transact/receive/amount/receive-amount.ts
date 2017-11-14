import { Component } from '@angular/core';
import { IonicPage, ViewController, NavParams } from 'ionic-angular';
import {ConfigService} from "merit/shared/config.service";

/**
 * This is the second primary step in the sending merit flow. 
 * It occurs after the user enters an address, but before the the user confirms.  
 */
@IonicPage()
@Component({
  selector: 'receive-amount-view',
  templateUrl: 'receive-amount.html',
})
export class ReceiveAmountView {

  public formData = {
    amount: '',
    currency: ''
  };

  public availableCurrencies = [];

  constructor(
    private viewCtrl:ViewController,
    private navParams:NavParams,
    private configService:ConfigService
  ) {

  }

  ionViewDidLoad() {
    let settings = this.configService.get().wallet.settings;

    this.availableCurrencies = [
      settings.unitName,
      settings.alternativeIsoCode || 'USD'
    ];
    this.formData.currency = this.availableCurrencies[0];

    let unitToMicro = settings.unitToMicro;
    let microToUnit = 1 / unitToMicro;
    let microsToMrt = 1 / 100000000;
    let unitDecimals = settings.unitDecimals;


  }

  close() {
    this.viewCtrl.dismiss();
  }

  setAmount() {
    this.viewCtrl.dismiss(this.formData.amount);
  }

}
