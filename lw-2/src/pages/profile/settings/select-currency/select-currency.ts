import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-select-currency',
  templateUrl: 'select-currency.html',
})
export class SelectCurrencyModal {

  public currentCurrency;
  public availableCurrencies;

  public searchQuery = '';

  foundCurrencies = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private viewCtrl:ViewController
  ) {
    this.currentCurrency   = this.navParams.get('currentCurrency');
    this.availableCurrencies = this.navParams.get('availableCurrencies');

    this.findCurrencies();
  }

  ionViewDidLoad() {
    //do something here
  }

  findCurrencies() {

    if (!this.searchQuery) {
      this.foundCurrencies = this.availableCurrencies;
    }  else {
      this.foundCurrencies = this.availableCurrencies.filter((c:string) => {
        return (c.toLowerCase().indexOf(this.searchQuery.toLowerCase()) != -1)
      });
    }
  }

  cancel() {
    this.viewCtrl.dismiss();
  }

  select(currency) {
    this.viewCtrl.dismiss(currency);
  }

}
