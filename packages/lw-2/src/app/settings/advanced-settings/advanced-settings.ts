import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'view-advanced-settings',
  templateUrl: 'advanced-settings.html',
})
export class AdvancedSettingsView {


  constructor(
    public navCtrl: NavController,
    public navParams: NavParams
  ) {

  }

  ionViewDidLoad() {
    //do something here
  }

  spendUnconfirmedChange() {

  }

  recentTransactionChange() {

  }

  nextStepsChange() {

  }


}
