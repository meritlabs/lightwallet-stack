import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'component-select-unit',
  templateUrl: 'select-unit.html',
})
export class SelectUnitModal {

  public currentUnit;
  public availableUnits;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private viewCtrl:ViewController
  ) {
    this.currentUnit   = this.navParams.get('currentUnit');
    this.availableUnits = this.navParams.get('availableUnits')
  }

  ionViewDidLoad() {
    //do something here
  }

  cancel() {
    this.viewCtrl.dismiss();
  }

  select(unit) {
    this.viewCtrl.dismiss(unit);
  }

}
