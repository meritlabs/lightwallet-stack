import { Injectable } from '@angular/core';
import * as Promise from 'bluebird';
import * as _ from 'lodash';

import { PersistenceService } from 'merit/core/persistence.service';

import { Contacts, Contact, ContactFieldType, IContactFindOptions } from '@ionic-native/contacts';
import { MeritContact, AddressBook } from 'merit/shared/address-book/contact/contact.model';
import { PlatformService } from 'merit/core/platform.service';

/**
 * This service looks up entered addresses against the address book.
 */
@Injectable()
export class AddressBookService {
  constructor(
    private persistenceService: PersistenceService,
    private platformService: PlatformService,
    private contacts:Contacts
  ) {}

  public get(addr: string, network: string): Promise<MeritContact> {
    return this.getAddressbook(network).then((addressBook) => {
      if (addressBook && addressBook[addr]) {
        return Promise.resolve(addressBook[addr]);
      }
      return Promise.reject(new Error('contact with address ' + addr + ' not found'));
    }, (err) => {
      return Promise.reject(new Error('error getting addressBook entry: ' + err));
    });
  };

  public list(network: string): Promise<AddressBook> {
    return this.getAddressbook(network).then((addressBook) => {
      return Promise.resolve(addressBook);
    }).catch((err) => {
      return Promise.reject(new Error('error listing addressBook: ' + err));
    });
  };

  public searchContacts(term: string): Promise<Contact[]> {
    let options: IContactFindOptions = {filter: term, multiple: true};
    let fields: ContactFieldType[] = ['name', 'phoneNumbers', 'emails'];

    if(!this.platformService.isMobile) return Promise.resolve([]);

    return Promise.resolve(this.contacts.find(fields, options)).catch((err) => {
      return Promise.reject(new Error('failed to search contacts: ' + err))
    })
  };

  public getAllDeviceContacts(): Promise<Contact[]> {
    return this.searchContacts('');
  }

  public add(entry: MeritContact, network: string): Promise<AddressBook> {
    return this.getAddressbook(network).then((addressBook) => {
      if (addressBook[entry.meritAddress]) return Promise.reject(new Error('contact already exists'));
      addressBook[entry.meritAddress] = entry;
      return Promise.resolve(JSON.stringify(addressBook));
    }).then((ab) => {
      return this.persistenceService.setAddressbook(network, ab).then(() => {
        return this.list(network);
      });
    });
  };

  public remove(addr: string, network: string): Promise<AddressBook> {
    return this.getAddressbook(network).then((addressBook) => {
      if (_.isEmpty(addressBook)) return Promise.reject(new Error('Addressbook is empty'));
      if (!addressBook[addr]) return Promise.reject(new Error('Entry does not exist'));
      delete addressBook[addr];
      return Promise.resolve(JSON.stringify(addressBook));
    }).then((ab) => {
      return this.persistenceService.setAddressbook(network, ab).then(() => {
        return this.list(network);
      });
    });
  };

  public removeAll(network: string): Promise<void> {
    return this.persistenceService.removeAddressbook(network).catch((err) => {
      return Promise.reject(new Error('could not removeAll contacts: ' + err))
    });
  };

  private getAddressbook(network: string): Promise<AddressBook> {
    return this.persistenceService.getAddressbook(network).then((ab) => {
      if(_.isEmpty) return {};
      return JSON.parse(ab);
    });
  }
}