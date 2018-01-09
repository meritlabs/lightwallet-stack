import { Component, SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Contact } from '@ionic-native/contacts';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import * as _ from 'lodash';
import { Logger } from 'merit/core/logger';
import { AddressBookService } from 'merit/shared/address-book/address-book.service';
import { MeritContact } from 'merit/shared/address-book/merit-contact.model';


@IonicPage({
  defaultHistory: ['SettingsView']
})
@Component({
  selector: 'addressbook-view',
  templateUrl: 'address-book.html',
})
export class AddressBookView {

  loading: boolean;
  public filteredContacts: Array<MeritContact> = [];
  public renderingContacts: Array<MeritContact> = [];
  searchQuery: string = '';
  contactsOffset = 0;
  contactsLimit = 10;
  private contacts: Array<MeritContact> = [];

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private addressBookService: AddressBookService,
              private logger: Logger,
              private sanitizer: DomSanitizer) {
  }

  ionViewWillEnter() {
    this.loading = true;
    this.updateContacts().then(() => {
      this.loading = false;
    });
  }

  renderMoreContacts(infiniteScroll) {
    this.contactsOffset += this.contactsLimit;
    this.renderingContacts = this.renderingContacts.concat(this.filteredContacts.slice(this.contactsOffset, this.contactsOffset + this.contactsLimit));
    infiniteScroll.complete();
  }

  sanitizePhotoUrl(url: string) {
    return this.sanitizer.sanitize(SecurityContext.URL, url);
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

  toContact(contact: Contact) {
    this.navCtrl.push('ContactView', { contact: contact });
  }

  private updateContacts(): Promise<void> {
    this.contactsOffset = 0;

    return this.addressBookService.getAllMeritContacts().then((contacts) => {
      this.contacts = contacts;
      this.filterContacts();
    });
  }

  private filterContacts(): void {
    this.contactsOffset = 0;
    this.filteredContacts = this.addressBookService.searchContacts(this.contacts, this.searchQuery);
    this.renderingContacts = this.filteredContacts.slice(0, this.contactsLimit);
  }
}
