import { Injectable } from '@angular/core';
import { Contact, ContactFieldType, Contacts, IContactFindOptions } from '@ionic-native/contacts';
import * as _ from 'lodash';
import { Logger } from 'merit/core/logger';
import { PersistenceService } from 'merit/core/persistence.service';
import { PlatformService } from 'merit/core/platform.service';
import { MeritContactBuilder } from 'merit/shared/address-book/merit-contact.builder';
import { AddressBook, MeritContact } from 'merit/shared/address-book/merit-contact.model';
import { ConfigService } from 'merit/shared/config.service';

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
              private meritContactBuilder: MeritContactBuilder) {
  }

  async get(addr: string, network: string): Promise<MeritContact> {
    try {
      const addressBook = await this.getAddressbook(network);

      if (addressBook && addressBook[addr]) {
        return addressBook[addr];
      }
    } catch (err) {
      throw new Error('error getting addressBook entry: ' + err);
    }

    throw new Error('contact with address ' + addr + ' not found');
  };

  list(network: string): Promise<AddressBook> {
    return this.getAddressbook(network)
      .catch((err) => {
        return Promise.reject(new Error('Error listing addressBook: ' + err));
      });
  };

  public searchDeviceContacts(term: string): Promise<Contact[]> {
    let options: IContactFindOptions = { filter: term, multiple: true };
    let fields: ContactFieldType[] = ['name', 'phoneNumbers', 'emails'];

    if (!this.platformService.isMobile) return Promise.resolve([]);

    return Promise.resolve(this.contacts.find(fields, options)).catch((err) => {
      return Promise.resolve([]);
    })
  };

  public getAllDeviceContacts(): Promise<Contact[]> {
    return this.searchDeviceContacts('');
  }

  public searchContacts(contacts: MeritContact[], searchQuery: string): MeritContact[] {
    searchQuery = searchQuery.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
    let exp = new RegExp(searchQuery, 'ig');
    return _.filter(contacts, (contact) => {

      if (contact.name.formatted && contact.name.formatted.match(exp)) return true;
      if (_.some(contact.emails, (email) => email.value.match(exp))) return true;
      if (_.some(contact.phoneNumbers, (phoneNumber) => phoneNumber.value.match(exp))) return true;
      if (_.some(contact.meritAddresses, (address) => address.address.match(exp))) return true;

      return false;

    });
  }

  public getAllMeritContacts(): Promise<MeritContact[]> {

    return this.getAllDeviceContacts().then((deviceContacts) => {

      return this.getAddressbook(this.configService.getDefaults().network.name).then((localContacts) => {

        let contacts = _.map(
          _.filter(deviceContacts,
            contact => !_.isEmpty(contact.phoneNumbers) || !_.isEmpty(contact.emails)
          ),
          contact => this.meritContactBuilder.build(contact)
        );

        _.each(_.map(localContacts, contact => contact), (contact) => {
          let currentContact = _.find(contacts, { id: contact.id });
          if (currentContact) {
            currentContact.meritAddresses = contact.meritAddresses;
          } else {
            contacts.push(contact);
          }
        })

        return contacts.sort((a, b) => {
          if (!(_.isEmpty(a.meritAddresses) || _.isEmpty(b.meritAddresses)) ||
            (_.isEmpty(a.meritAddresses) && (_.isEmpty(b.meritAddresses)))) {
            return a.name.formatted > b.name.formatted ? 1 : -1;
          }
          return (!_.isEmpty(a.meritAddresses)) ? -1 : 1;
        });

      })
    });
  }

  async add(entry: MeritContact, address: string, network: string): Promise<AddressBook> {
    const addressBook = await this.getAddressbook(network);
    addressBook[address] = entry;
    await this.persistenceService.setAddressbook(network, addressBook);
    return addressBook;
  };

  public bindAddressToContact(contact:MeritContact, address:string, network:string) {

    return this.getAddressbook(network).then((addressBook) => {
      let existingContact:MeritContact;
      if (!_.isEmpty(contact.meritAddresses)) {
        _.some(contact.meritAddresses, (mAddress) => {
            existingContact = addressBook[mAddress.address];
            return existingContact;
        });
      }
      if (existingContact) {
        existingContact.meritAddresses.push({address: address, network: network});
      } else {
        contact.meritAddresses.push({address: address, network: network});
        addressBook[address] = contact;
      }
      return this.persistenceService.setAddressbook(network, addressBook).then(() => {
        return addressBook;
      });
    });
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
      return Promise.reject(new Error('Could not removeAll contacts: ' + err))
    });
  };

  async getAddressbook(network: string): Promise<AddressBook> {
    const addressBook = await this.persistenceService.getAddressbook(network);
    return _.isEmpty(addressBook) ? {} : addressBook;
  }
}