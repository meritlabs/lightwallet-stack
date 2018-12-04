import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { ENV } from '@app/env';
import { Contact, IContactField } from '@ionic-native/contacts';
import { IAddressBook, MeritContact } from '@merit/common/models/merit-contact';
import { PersistenceService } from '@merit/common/services/persistence.service';
import { createMeritContact } from '@merit/common/utils/contacts';

@Injectable()
export class ContactsService {
  // TODO cache contacts & re-use instead of retrieving them again
  protected contacts: MeritContact[];
  protected addressBook: IAddressBook;

  init: Promise<void>;

  constructor(private persistenceService: PersistenceService) {
    this.init = this._init();
  }

  protected async _init() {
    this.addressBook = await this.getAddressbook();

    this.contacts = await this.getAllMeritContacts();

    if (_.isEmpty(this.addressBook)) {
      this.contacts.forEach((contact: MeritContact) =>
        contact.meritAddresses.forEach(({ address, alias }) => {
          if (address) this.addressBook[address] = contact;
          if (alias) this.addressBook[alias] = contact;
        }),
      );

      await this.persistenceService.setAddressbook(ENV.network, this.addressBook);
    }
  }

  list(network: string = ENV.network): Promise<IAddressBook> {
    return this.getAddressbook(network).catch(err => {
      return Promise.reject(new Error('Error listing addressBook: ' + err));
    });
  }

  async add(entry: MeritContact, address: string, network: string = ENV.network): Promise<IAddressBook> {
    this.addressBook[address] = entry;
    await this.persistenceService.setAddressbook(network, this.addressBook);
    return this.addressBook;
  }

  async bindAddressToContact(contact: MeritContact, address: string, alias?: string) {
    const addressBook: IAddressBook = await this.getAddressbook(ENV.network);

    let existingContact: MeritContact;
    if (!_.isEmpty(contact.meritAddresses)) {
      contact.meritAddresses.some(mAddress => {
        existingContact = addressBook[mAddress.address];
        return !!existingContact;
      });
    }
    if (existingContact) {
      existingContact.meritAddresses.push({ address: address, alias: alias, network: ENV.network });
    } else {
      contact.meritAddresses.push({ address: address, network: ENV.network });
      addressBook[address] = contact;
    }

    await this.persistenceService.setAddressbook(ENV.network, addressBook);
    return existingContact || contact;
  }

  get(addr: string): MeritContact {
    try {
      if (this.addressBook && this.addressBook[addr]) {
        return this.addressBook[addr];
      }
    } catch (err) {
      throw new Error('Contact with address ' + addr + ' not found');
    }
  }

  searchContacts(contacts: MeritContact[], searchQuery: string = ''): MeritContact[] {
    searchQuery = searchQuery.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
    const exp = new RegExp(searchQuery, 'ig');
    return contacts.filter((contact: MeritContact) => {
      if (contact.name.formatted && contact.name.formatted.match(exp)) return true;
      if (_.some(contact.emails, email => email.value.match(exp))) return true;
      if (_.some(contact.phoneNumbers, phoneNumber => phoneNumber.value.match(exp))) return true;
      if (_.some(contact.meritAddresses, address => address.address.match(exp))) return true;
      if (_.some(contact.meritAddresses, address => address.alias && address.alias.match(exp))) return true;
      return false;
    });
  }

  async getAllMeritContacts(deviceContacts: Contact[] = []): Promise<MeritContact[]> {
    const localContacts: IAddressBook = await this.getAddressbook();

    const contacts: MeritContact[] = deviceContacts
      .filter(
        (contact: Contact) =>
          (!_.isEmpty(contact.displayName) && !_.isEmpty(contact.phoneNumbers)) || !_.isEmpty(contact.emails),
      )
      .map((contact: Contact) => createMeritContact(contact));

    let localContact: MeritContact, deviceContact: MeritContact;

    Object.keys(localContacts).forEach((key: string) => {
      localContact = localContacts[key];

      if (localContact.id || localContact.phoneNumbers.length || localContact.emails.length) {
        deviceContact = contacts.find(
          (c: MeritContact) =>
            // find by ID
            localContact.id === c.id ||
            // find by phone number
            localContact.phoneNumbers.some((p: IContactField) =>
              Boolean(c.phoneNumbers.find(_p => _p.value == p.value)),
            ) ||
            // compare emails
            localContact.emails.some((e: IContactField) => Boolean(c.emails.find(_e => _e.value == e.value))),
        );

        if (deviceContact) {
          // merge addresses
          deviceContact.meritAddresses = _.uniq(
            Array.prototype.concat(deviceContact.meritAddresses || [], localContact.meritAddresses || []),
          );
          deviceContact = void 0;
          return;
        }
      }

      contacts.push(localContact);
    });

    localContact = void 0;

    return _.sortBy(contacts, ['name.formatted']);
  }

  async remove(addr: string, network: string = ENV.network): Promise<IAddressBook> {
    delete this.addressBook[addr];
    await this.persistenceService.setAddressbook(network, this.addressBook);
    return this.addressBook;
  }

  deleteAddressBook() {
    return this.persistenceService.setAddressbook(ENV.network, {});
  }

  async getAddressbook(network: string = ENV.network): Promise<IAddressBook> {
    const addressBook = await this.persistenceService.getAddressbook(network);
    return _.isEmpty(addressBook) ? {} : addressBook;
  }
}
