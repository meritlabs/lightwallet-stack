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

  loading:boolean;
  contacts:Array<any> = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private addressBookService: AddressBookService,
    private logger: Logger,
  ) {
  }

  ionViewWillEnter() {
    this.loading = true;
    this.updateContacts().then(() => {
      this.loading = false;
    })
  }

  private updateContacts() {
    return new Promise((resolve, reject) => {
      this.addressBookService.getAddressbook('testnet').then((addressbook) => {
        let meritContacts  = _.map(addressbook, (value) => value);

        this.addressBookService.getAllDeviceContacts().then((deviceContacts) => {

          this.contacts = meritContacts.concat(deviceContacts);

          this.contacts.sort((a,b) => {
            if ( (a.meritAddress && b.meritAddress) || (!a.meritAddress && !b.meritAddress) ) {
              return a.name > b.name ? 1 : -1;
            } else {
              return a.meritAddress ? -1 : 1;
            }
          });
          resolve();

        });

      });
    });
  }

  doRefresh(refresher) {
    this.updateContacts().then(() => {
      refresher.complete()
    });
  }

  hasContacts(): boolean {
    return !_.isEmpty(this.contacts);
  }

  toAddContact() {
    this.navCtrl.push('EditContactView');
  }

  toContact(contact) {
    this.navCtrl.push('ContactView', {contact: contact});
  }
}
