import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {ContactsService} from "../../../../providers/contacts-service";


@IonicPage({
  defaultHistory: ['SettingsView']
})
@Component({
  selector: 'page-addressbook',
  templateUrl: 'addressbook.html',
})
export class AddressbookView {

  contacts = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private contactsService:ContactsService
  ) {
  }

  ionViewDidLoad() {
    this.contacts = this.contactsService.getContacts();
  }

  toAddContact() {
    this.navCtrl.push('AddContactView');
  }

  toContact(contact) {
    this.navCtrl.push('ContactView', {contact: contact});
  }





}
