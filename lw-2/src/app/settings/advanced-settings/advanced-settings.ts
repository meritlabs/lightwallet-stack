import { Component } from '@angular/core';
import { IonicComponent, NavController, NavParams } from 'ionic-angular';


@IonicComponent()
@Component({
  selector: 'component-advanced-settings',
  templateUrl: 'advanced-settings.html',
})
export class AdvancedSettingsComponent {


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
