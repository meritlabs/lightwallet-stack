import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';


@IonicPage({
  defaultHistory: ['OnboardingPage']
})
@Component({
  selector: 'page-unlock',
  templateUrl: 'unlock.html',
})
export class UnlockPage {

  public unlockState:'success'|'fail';
  public formData = {unockCode: ''};

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams
  ) {
  }

  ionViewDidLoad() {
    //do something here
  }

  unlock() {
    //unlock actions
    this.unlockState = 'success';
    this.navCtrl.push('TransactPage');
  }

}
