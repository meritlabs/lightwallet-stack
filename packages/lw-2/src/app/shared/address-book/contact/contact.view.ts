import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

// Contacts view (component)
@IonicPage()
@Component({
  selector: 'view-contact',
  templateUrl: 'contact.html',
})
export class ContactView {

  constructor(
    public navCtrl: NavController,
  ) {

  }

  ionViewDidLoad() {
    //do something here

  }
}
