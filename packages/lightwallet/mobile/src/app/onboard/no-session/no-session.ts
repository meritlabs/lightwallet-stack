import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'view-no-session',
  templateUrl: 'no-session.html',
})
export class NoSessionView {
  constructor(private navCtrl: NavController, private navParams: NavParams) {}

  ionViewDidLoad() {
    //do something here
  }

  toUnlockView() {
    this.navCtrl.push('UnlockView');
  }

  toImportView() {
    this.navCtrl.push('ImportView');
  }
}
