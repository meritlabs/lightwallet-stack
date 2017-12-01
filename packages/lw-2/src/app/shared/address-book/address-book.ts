import * as _ from 'lodash';
import * as Promise from 'bluebird';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AddressBookService } from 'merit/shared/address-book/address-book.service';
import { AddressBook, MeritContact } from 'merit/shared/address-book/contact/contact.model';
import { Logger } from 'merit/core/logger';


@IonicPage({
  defaultHistory: ['SettingsView']
})
@Component({
  selector: 'addressbook-view',
  templateUrl: 'address-book.html',
})
export class AddressBookView {

  addressBook: AddressBook;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private addressBookService: AddressBookService,
    private logger: Logger,
  ) {
  }

  async ionViewWillEnter() {
    await this.updateAddressBook().then(() => {
      this.logger.warn('got addressbook:');
      this.logger.warn(this.addressBook);
    });
  }

  getContactList(): MeritContact[] {
    return _.map(this.addressBook, (value) => value);
  }

  updateAddressBook(): Promise<void> {
    return this.addressBookService.list('testnet').then((addressBook) => {
      this.addressBook = addressBook;
      return Promise.resolve();
    });
  }

  hasContacts(): boolean {
    return !_.isEmpty(this.addressBook);
  }

  toAddContact() {
    this.navCtrl.push('AddContactView');
  }

  toContact(contact) {
    this.navCtrl.push('ContactView', {contact: contact});
  }
}
