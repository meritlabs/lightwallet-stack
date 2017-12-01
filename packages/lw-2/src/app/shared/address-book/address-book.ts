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

  searchQuery:string = '';

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

      //TODO concat with local addressbook
      this.addressBookService.getAllDeviceContacts().then((deviceContacts) => {

        console.log('DEVICE CONTACTS', deviceContacts);
        let contacts = deviceContacts.map((contact) => new MeritContact(contact));
        contacts.sort((a,b) => {
          if ((a.meritAddresses.length && b.meritAddresses.length) || (a.meritAddresses.length && b.meritAddresses.length)) {
            return a.name.formatted > b.name.formatted ? 1 : -1;
          } else {
            return a.meritAddresses.length ? -1 : 1;
          }
        });

        this.contacts = contacts;
        resolve();
      });

    });
  }

  private filterContacts() {
    if (!this.searchQuery) return this.filteredContacts = this.contacts;

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

      //contact.meritAddresses.forEach((address) => {
      //  //if (address.address.match(exp)) hasMatches = true;
      //});

      return hasMatches;

    });


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
