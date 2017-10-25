import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'component-onboarding',
  templateUrl: 'onboarding.html',
})
export class OnboardingComponent {


  constructor(
    public navCtrl: NavController,
    public navParams: NavParams
  ) {

  }

  ionViewDidLoad() {
    //do something here
  }

  toTourComponent() {
    this.navCtrl.push('TourComponent');
  }

  toImportComponent() {
    this.navCtrl.push('ImportComponent')
  }

}
