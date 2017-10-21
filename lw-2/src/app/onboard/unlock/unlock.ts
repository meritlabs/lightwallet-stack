import { Component } from '@angular/core';
import { IonicComponent, NavController, NavParams } from 'ionic-angular';


@IonicComponent({
  defaultHistory: ['OnboardingComponent']
})
@Component({
  selector: 'component-unlock',
  templateUrl: 'unlock.html',
})
export class UnlockComponent {

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
    this.navCtrl.push('TransactComponent');
  }

  function 

}
