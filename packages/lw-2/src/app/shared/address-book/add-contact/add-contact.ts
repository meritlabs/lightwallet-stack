import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MeritContact, isValidMeritContact, emptyMeritContact } from "merit/shared/address-book/contact/contact.model";

// Add Contact Screen
@IonicPage()
@Component({
  selector: 'view-add-contact',
  templateUrl: 'add-contact.html',
})
export class AddContactView {

  public contact:MeritContact;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams
  ) {

  }

  ionViewDidLoad() {
    this.contact = emptyMeritContact();
  }

  isValid(): boolean {
    return isValidMeritContact(this.contact);
  }

  openQrScanner() {

  }

  add() {
    //todo implement
    this.navCtrl.pop();
  }

}
