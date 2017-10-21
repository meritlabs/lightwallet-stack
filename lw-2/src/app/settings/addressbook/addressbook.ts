import { Component } from '@angular/core';
import { IonicComponent, NavController, NavParams } from 'ionic-angular';
import {ContactsService} from "../../../../providers/contacts-service";


@IonicComponent({
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
