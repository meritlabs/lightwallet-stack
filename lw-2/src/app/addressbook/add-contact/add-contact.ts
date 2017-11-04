import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Contact } from "merit/shared/address-book/contact/contact.model";

// Add Contact Screen
@IonicPage()
@Component({
  selector: 'view-add-contact',
  templateUrl: 'add-contact.html',
})
export class AddContactView {

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
