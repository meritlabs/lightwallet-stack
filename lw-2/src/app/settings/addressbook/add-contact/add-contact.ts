import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {Contact} from "../../../../../models/contact";


@IonicPage()
@Component({
  selector: 'page-add-contact',
  templateUrl: 'add-contact.html',
})
export class AddContactPage {

  public contact:Contact;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams
  ) {

  }

  ionViewDidLoad() {
    this.contact = new Contact();
  }

  openQrScanner() {

  }

  add() {
    //todo implement
    this.navCtrl.pop();
  }

}
