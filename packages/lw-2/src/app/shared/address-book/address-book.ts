import * as _ from 'lodash';
import * as Promise from 'bluebird';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AddressBookService } from 'merit/shared/address-book/address-book.service';
import { Logger } from 'merit/core/logger';
import { Contact } from '@ionic-native/contacts';
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

  private contacts:Array<MeritContact> = [];
  private filteredContacts:Array<MeritContact> = [];
  private renderingContacts:Array<MeritContact> = [];

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
      this.loading = false;
    });
  }

  private updateContacts(): Promise<void> {
    this.contactsOffset = 0;

    return this.addressBookService.getAllMeritContacts().then((contacts) => {
      this.contacts = contacts;
      this.filterContacts();
    });
  }

  private filterContacts(): void{
    this.contactsOffset = 0;
    this.filteredContacts = this.addressBookService.searchContacts(this.contacts, this.searchQuery);
    this.renderingContacts = this.filteredContacts.splice(0, this.contactsLimit);
  }

  renderMoreContacts(infiniteScroll) {
    console.log('RENDERING MORE CONTACTS');
    this.contactsOffset += this.contactsLimit;
    this.renderingContacts = this.renderingContacts.concat(this.filteredContacts.splice(this.contactsOffset, this.contactsOffset+this.contactsLimit));
    infiniteScroll.complete();
  }


  sanitizePhotoUrl(url:string) {
    return this.sanitizer.bypassSecurityTrustUrl(url);
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

  toContact(contact:Contact) {
    this.navCtrl.push('ContactView', {contact: contact});
  }
}
