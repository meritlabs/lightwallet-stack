import { Injectable } from '@angular/core';
import { Contact, ContactFieldType, Contacts, IContactField, IContactFindOptions } from '@ionic-native/contacts';
import * as _ from 'lodash';
import { Logger } from 'merit/core/logger';
import { PersistenceService } from 'merit/core/persistence.service';
import { PlatformService } from 'merit/core/platform.service';
import { MeritContactBuilder } from 'merit/shared/address-book/merit-contact.builder';
import { AddressBook, MeritContact } from 'merit/shared/address-book/merit-contact.model';
import { ConfigService } from 'merit/shared/config.service';
import { ContactsProvider } from '../../../providers/contacts/contacts';

/**
 * This service looks up entered addresses against the address book.
 */
@Injectable()
export class AddressBookService {
  constructor(private persistenceService: PersistenceService,
              private platformService: PlatformService,
              private configService: ConfigService,
              private contacts: Contacts,
              private logger: Logger,
              private meritContactBuilder: MeritContactBuilder,
              private contactsProvider: ContactsProvider) {
  }

  async get(addr: string, network: string): Promise<MeritContact> {
    try {
      const addressBook = await this.getAddressbook(network);

      if (addressBook && addressBook[addr]) {
        return addressBook[addr];
      }
    } catch (err) {
      throw new Error('Error getting addressBook entry: ' + err);
    }

    throw new Error('Contact with address ' + addr + ' not found');
  };

  list(network: string): Promise<AddressBook> {
    return this.getAddressbook(network)
      .catch((err) => {
        return Promise.reject(new Error('Error listing addressBook: ' + err));
      });
  };

  async searchDeviceContacts(term: string): Promise<Contact[]> {
    if (!await this.contactsProvider.requestPermission() || !Contacts.installed()) {
      console.log('Do not have permission');
      return [];
    }

    let options: IContactFindOptions = { filter: term, multiple: true };
    let fields: ContactFieldType[] = ['name', 'phoneNumbers', 'emails'];

    return this.contacts.find(fields, options).catch(() => {
      return Promise.resolve([]);
    });
  };

  getAllDeviceContacts(): Promise<Contact[]> {
    return this.contactsProvider.getAllContacts();
  }

  searchContacts(contacts: MeritContact[], searchQuery: string = ''): MeritContact[] {
    searchQuery = searchQuery.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
    const exp = new RegExp(searchQuery, 'ig');
    return contacts.filter((contact: MeritContact) => {
      if (contact.name.formatted && contact.name.formatted.match(exp)) return true;
      if (_.some(contact.emails, (email) => email.value.match(exp))) return true;
      if (_.some(contact.phoneNumbers, (phoneNumber) => phoneNumber.value.match(exp))) return true;
      if (_.some(contact.meritAddresses, (mAddress) => mAddress.address.match(exp))) return true;
      if (_.some(contact.meritAddresses, (mAddress) => mAddress.alias && mAddress.alias.match(exp))) return true;
      return false;
    });
  }

  async getAllMeritContacts(): Promise<MeritContact[]> {
    const deviceContacts: Contact[] = await this.getAllDeviceContacts();
    const localContacts: AddressBook = await this.getAddressbook(this.configService.getDefaults().network.name);

    const contacts: MeritContact[] = deviceContacts
      .filter((contact: Contact) => !_.isEmpty(contact.displayName) && !_.isEmpty(contact.phoneNumbers) || !_.isEmpty(contact.emails))
      .map((contact: Contact) => this.meritContactBuilder.build(contact));

    let localContact: MeritContact, deviceContact: MeritContact;

    Object.keys(localContacts)
      .forEach((key: string) => {
        localContact = localContacts[key];
        deviceContact = contacts.find((c: MeritContact) =>
          // find by ID
          (localContact.id === c.id) ||
          // find by phone number
          (localContact.phoneNumbers.some((p: IContactField) => Boolean(c.phoneNumbers.find(_p => _p.value == p.value)))) ||
          // compare emails
          (localContact.emails.some((e: IContactField) => Boolean(c.emails.find(_e => _e.value == e.value))))
        );

        if (deviceContact) {
          // merge addresses
          deviceContact.meritAddresses = _.uniq(Array.prototype.concat((deviceContact.meritAddresses || []), (localContact.meritAddresses || [])));
        } else {
          contacts.push(localContact);
        }

        deviceContact = void 0;
      });

    localContact = void 0;

    return _.sortBy(contacts, ['name.formatted']);
  }

  async add(entry: MeritContact, address: string, network: string): Promise<AddressBook> {
    const addressBook = await this.getAddressbook(network);
    addressBook[address] = entry;
    await this.persistenceService.setAddressbook(network, addressBook);
    return addressBook;
  };

  async bindAddressToContact(contact: MeritContact, address: string, network: string) {
    const addressBook: AddressBook = await this.getAddressbook(network);

    let existingContact: MeritContact;
    if (!_.isEmpty(contact.meritAddresses)) {
      _.some(contact.meritAddresses, (mAddress) => {
        existingContact = addressBook[mAddress.address];
        return existingContact;
      });
    }
    if (existingContact) {
      existingContact.meritAddresses.push({ address: address, network: network });
    } else {
      contact.meritAddresses.push({ address: address, network: network });
      addressBook[address] = contact;
    }

    return this.persistenceService.setAddressbook(network, addressBook);
  }

  async remove(addr: string, network: string): Promise<AddressBook> {
    const addressBook = await this.getAddressbook(network);
    console.log(addressBook, addr, network);
    delete addressBook[addr];
    await this.persistenceService.setAddressbook(network, addressBook);
    return addressBook;
  };

  removeAll(network: string): Promise<void> {
    return this.persistenceService.removeAddressbook(network).catch((err) => {
      return Promise.reject(new Error('Could not removeAll contacts: ' + err));
    });
  };

  async getAddressbook(network: string): Promise<AddressBook> {
    const addressBook = await this.persistenceService.getAddressbook(network);
    return _.isEmpty(addressBook) ? {} : addressBook;
  }
}
