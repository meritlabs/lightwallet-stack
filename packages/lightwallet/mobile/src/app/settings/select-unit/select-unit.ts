import { Component } from '@angular/core';
import { IonicPage, NavParams, ViewController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'view-select-unit',
  templateUrl: 'select-unit.html',
})
export class SelectUnitModal {
  currentUnit;
  availableUnits;

  constructor(private navParams: NavParams, private viewCtrl: ViewController) {
    this.currentUnit = this.navParams.get('currentUnit');
    this.availableUnits = this.navParams.get('availableUnits');
  }

  cancel() {
    this.viewCtrl.dismiss();
  }

  select(unit) {
    this.viewCtrl.dismiss(unit);
  }
}
