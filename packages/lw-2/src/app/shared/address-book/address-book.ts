import * as _ from 'lodash';
import * as Promise from 'bluebird';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AddressBookService } from 'merit/shared/address-book/address-book.service';
//import { AddressBook, MeritContact } from 'merit/shared/address-book/contact/contact.model';
import { Logger } from 'merit/core/logger';
import { Contact } from '@ionic-native/contacts';
//import {emptyMeritContact} from "./contact/contact.model";
import { MeritContact } from "merit/shared/address-book/merit-contact.model";
import { DomSanitizer } from '@angular/platform-browser';


@IonicPage({
  defaultHistory: ['SettingsView']
})
@Component({
  selector: 'addressbook-view',
  templateUrl: 'address-book.html',
})
export class AddressBookView {

  loading:boolean;

  contacts:Array<MeritContact> = [];
  filteredContacts:Array<MeritContact> = [];
  renderingContacts:Array<MeritContact> = [];

  searchQuery:string = '';

  contactsOffset = 0;
  contactsLimit  = 20;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private addressBookService: AddressBookService,
    private logger: Logger,
    private sanitizer:DomSanitizer
  ) {
  }

  ionViewWillEnter() {
    this.loading = true;
    this.updateContacts().then(() => {
      this.filterContacts();
      this.loading = false;
    })
  }

  private updateContacts() {
    return new Promise((resolve, reject) => {

      this.contactsOffset = 0;

      this.addressBookService.getAddressbook('testnet').then((addressBook) => {

        this.addressBookService.getAllDeviceContacts().then((deviceContacts) => {

          let contacts = deviceContacts.map((contact) => new MeritContact(contact));
          contacts = contacts.concat( _.map(addressBook, value => value) );

          contacts.sort((a,b) => {
            if ((a.meritAddresses.length && b.meritAddresses.length) || (a.meritAddresses.length && b.meritAddresses.length)) {
              return a.name.formatted > b.name.formatted ? 1 : -1;
            } else {
              return a.meritAddresses.length ? -1 : 1;
            }
          });

          this.contacts = contacts;
          this.filterContacts();
          resolve();
        });

      });

    });
  }

  private filterContacts() {
    this.contactsOffset = 0;

    if (!this.searchQuery) {
      this.filteredContacts = this.contacts;
      return this.renderingContacts = this.filteredContacts.splice(this.contactsOffset, this.contactsLimit);
    }


    let exp = new RegExp(this.searchQuery, 'ig');
    this.filteredContacts = this.contacts.filter((contact) => {

      let hasMatches = false;

      if (contact.name.formatted.match(exp)) hasMatches = true;

      contact.emails.forEach((email) => {
        if (email.value.match(exp)) hasMatches =  true;
      });

      contact.phoneNumbers.forEach((phone) => {
        if (phone.value.match(exp)) hasMatches = true;
      });

      contact.meritAddresses.forEach((address) => {
        if (address.address.match(exp)) hasMatches = true;
      });

      return hasMatches;

    });

    this.renderingContacts = this.filteredContacts.splice(0, this.contactsLimit);

  }

  renderMoreContacts(infiniteScroll) {
    console.log('RENDERING MORE CONTACTS');
    this.contactsOffset += this.contactsLimit;
    this.renderingContacts = this.renderingContacts.concat(this.filterContacts().splice(this.contactsOffset, this.contactsOffset+this.contactsLimit));
    infiniteScroll.complete();
  }


  sanitizePhotoUrl(url:string) {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  doRefresh(refresher) {
    this.updateContacts().then(() => {
      this.filterContacts();
      refresher.complete()
    });
  }

  hasContacts(): boolean {
    return !_.isEmpty(this.contacts);
  }

  toAddContact() {
    this.navCtrl.push('EditContactView');
  }

  toContact(contact:Contact) {
    this.navCtrl.push('ContactView', {contact: contact});
  }
}
