import { Injectable } from '@angular/core';
import * as Promise from 'bluebird';
import * as _ from 'lodash';

import { PersistenceService } from 'merit/core/persistence.service';

import { Contacts, Contact, ContactFieldType, IContactFindOptions } from '@ionic-native/contacts';
import { MeritContact, AddressBook } from 'merit/shared/address-book/merit-contact.model';
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

  public searchDeviceContacts(term: string): Promise<Contact[]> {
    let options: IContactFindOptions = {filter: term, multiple: true};
    let fields: ContactFieldType[] = ['name', 'phoneNumbers', 'emails'];

    if(!this.platformService.isMobile) return Promise.resolve([]);

    return Promise.resolve(this.contacts.find(fields, options)).catch((err) => {
      return Promise.resolve([]);
    })
  };

  public getAllDeviceContacts(): Promise<Contact[]> {
    return this.searchDeviceContacts('');
  }

  public searchContacts(contacts: MeritContact[], searchQuery: string): MeritContact[] {
    let exp = new RegExp(searchQuery, 'ig');
    return _.filter(contacts, (contact) => {

      if (contact.name.formatted.match(exp)) return true;
      if (_.some(contact.emails, (email) => email.value.match(exp))) return true;
      if (_.some(contact.phoneNumbers, (phoneNumber) => phoneNumber.value.match(exp))) return true;
      if (_.some(contact.meritAddresses, (address) => address.address.match(exp))) return true;

      return false;

    });
  }

  public getAllMeritContacts(): Promise<MeritContact[]> {

    return this.getAllDeviceContacts().then((deviceContacts) => {

      return this.getAddressbook('testnet').then((localContacts) => {

        let contacts = _.map(deviceContacts, contact => MeritContact.fromDeviceContact(contact));
        contacts = contacts.concat(_.map(localContacts, contact => MeritContact.fromAddressBookContact(contact)));

        return contacts.sort((a,b) => {
          if ((a.meritAddresses.length && b.meritAddresses.length) || (a.meritAddresses.length && b.meritAddresses.length)) {
            return a.name.formatted > b.name.formatted ? 1 : -1;
          } else {
            return a.meritAddresses.length ? -1 : 1;
          }
        });

      })
    });
  }

  public add(entry: MeritContact, network: string): Promise<AddressBook> {
    return new Promise((resolve, reject) => {
      return this.getAddressbook(network).then((addressBook) => {
        if (addressBook[entry.meritAddresses[0].address]) return reject(new Error('contact already exists'));
        addressBook[entry.meritAddresses[0].address] = entry;
        return this.persistenceService.setAddressbook(network, addressBook).then(() => {
          return resolve();
        });
      });
    });
  };

  public remove(addr: string, network: string): Promise<AddressBook> {
    return new Promise((resolve, reject) => {
      this.getAddressbook(network).then((addressBook) => {
        delete addressBook[addr];
        return this.persistenceService.setAddressbook(network, addressBook).then(() => {
          return resolve();
        });
      });
    });
  };

  public removeAll(network: string): Promise<void> {
    return this.persistenceService.removeAddressbook(network).catch((err) => {
      return Promise.reject(new Error('could not removeAll contacts: ' + err))
    });
  };

  public getAddressbook(network: string): Promise<AddressBook> {
    return new Promise((resolve, reject) => {
      return this.persistenceService.getAddressbook(network).then((ab) => {
        if(_.isEmpty(ab)) ab = {};
        resolve(ab);
      });
    });
  }
}