import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {ContactsService} from "../../../../providers/contacts-service";


@IonicPage({
  defaultHistory: ['SettingsPage']
})
@Component({
  selector: 'page-addressbook',
  templateUrl: 'addressbook.html',
})
export class AddressbookPage {

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
    this.navCtrl.push('AddContactPage');
  }

  toContact(contact) {
    this.navCtrl.push('ContactPage', {contact: contact});
  }





}
