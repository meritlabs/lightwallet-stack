import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {ContactsService} from "../../../../providers/contacts-service";


@IonicPage({
  defaultHistory: ['SettingsComponent']
})
@Component({
  selector: 'component-addressbook',
  templateUrl: 'addressbook.html',
})
export class AddressbookComponent {

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
    this.navCtrl.push('AddContactComponent');
  }

  toContact(contact) {
    this.navCtrl.push('ContactComponent', {contact: contact});
  }





}
