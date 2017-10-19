import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';


@IonicPage({
  defaultHistory: ['SettingsPage']
})
@Component({
  selector: 'page-addressbook',
  templateUrl: 'addressbook.html',
})
export class AddressbookPage {


  constructor(
    public navCtrl: NavController,
    public navParams: NavParams
  ) {

  }

  ionViewDidLoad() {
    //do something here
  }

}
