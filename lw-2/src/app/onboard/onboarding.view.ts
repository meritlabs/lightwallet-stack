import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';


// The onboarding view (component)
@IonicPage()
@Component({
  selector: 'view-onboarding',
  templateUrl: 'onboarding.html',
})
export class OnboardingView {


  constructor(
    public navCtrl: NavController,
    public navParams: NavParams
  ) {

  }

  ionViewDidLoad() {
    //do something here
  }

  toTourView() {
    this.navCtrl.push('TourView');
  }

  toImportView() {
    this.navCtrl.push('ImportView')
  }

}
