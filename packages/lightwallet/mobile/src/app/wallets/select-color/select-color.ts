import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'view-select-color',
  templateUrl: 'select-color.html',
})
export class SelectColorView {
  availableColors = [
    '#e57373',
    '#e985a7',
    '#ca85d6',
    '#a185d4',
    '#7987d1',
    '#64aae3',
    '#53b9e8',
    '#4ccdde',
    '#48ae6c',
    '#44baad',
    '#99c666',
    '#bcc84c',
    '#f5a623',
    '#ffc30e',
    '#ffaf37',
    '#8997eb',
    '#808080',
    '#5f6c82',
    '#383d43',
  ];

  selectedColor: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, private viewCtrl: ViewController) {}

  cancel() {
    this.viewCtrl.dismiss();
  }

  select(color) {
    this.viewCtrl.dismiss(color);
  }
}
