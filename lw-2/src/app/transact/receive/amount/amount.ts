import { Component } from '@angular/core';
import { IonicPage, ViewController, NavParams } from 'ionic-angular';
import {ConfigService} from "../../../shared/config.service";


@IonicPage()
@Component({
  selector: 'view-amount',
  templateUrl: 'amount.html',
})
export class AmountView {

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

    let unitToMicro = settings.unitToSatoshi;
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
