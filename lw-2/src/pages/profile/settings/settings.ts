import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {


  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private app:App
  ) {

  }

  ionViewDidLoad() {
    //do something here
  }

  logout() {
    this.app.getRootNav().setRoot('OnboardingPage');
  }

}
