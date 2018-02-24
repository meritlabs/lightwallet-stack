import { Injectable } from '@angular/core';
import { Contact, Contacts, IContactField } from '@ionic-native/contacts';
import { Diagnostic } from '@ionic-native/diagnostic';
import { PersistenceService } from 'merit/core/persistence.service';
import { IAddressBook, MeritContact } from '../../models/merit-contact';
import { ConfigService } from 'merit/shared/config.service';
import { createMeritContact } from '../../utils/contacts';
import * as _ from 'lodash';
import { ENV } from '@app/env';

const DESIRED_FIELDS = [
  'displayName',
  'emails',
  'name',
  'phoneNumbers',
  'photos'
];

@Injectable()
export class ContactsProvider {

  // TODO cache contacts & re-use instead of retrieving them again
  private contacts: MeritContact[];
  private addressBook: IAddressBook;
  private devicePermissionGranted: boolean;
  private devicePermissionStatus: string;

  init: Promise<void>;

  constructor(private deviceContactsProvider: Contacts,
              private deviceDiagnosticProvider: Diagnostic,
              private persistenceService: PersistenceService,
              private configService: ConfigService) {
    this.init = this._init();
  }

  private async _init() {
    this.addressBook = await this.getAddressbook();
    this.devicePermissionGranted = await this.hasDevicePermission();

    if (!this.devicePermissionGranted && Diagnostic.installed()) {
      this.devicePermissionStatus = await this.deviceDiagnosticProvider.getContactsAuthorizationStatus();
    }

    this.contacts = await this.getAllMeritContacts();

    if (_.isEmpty(this.addressBook)) {
      this.contacts.forEach((contact: MeritContact) =>
        contact.meritAddresses.forEach(({ address, alias }) => {
          if (address) this.addressBook[address] = contact;
          if (alias) this.addressBook[alias] = contact;
        })
      );

      await this.persistenceService.setAddressbook(ENV.network, this.addressBook);
    }
  }

  list(network: string = ENV.network): Promise<IAddressBook> {
    return this.getAddressbook(network)
      .catch((err) => {
        return Promise.reject(new Error('Error listing addressBook: ' + err));
      });
  };

  async add(entry: MeritContact, address: string, network: string = ENV.network): Promise<IAddressBook> {
    this.addressBook[address] = entry;
    await this.persistenceService.setAddressbook(network, this.addressBook);
    return this.addressBook;
  };

  async bindAddressToContact(contact: MeritContact, address: string, network: string = ENV.network) {
    const addressBook: IAddressBook = await this.getAddressbook(network);

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

  get(addr: string): MeritContact {
    try {
      if (this.addressBook && this.addressBook[addr]) {
        return this.addressBook[addr];
      }
    } catch (err) {
      throw new Error('Contact with address ' + addr + ' not found');
    }
  };

  searchContacts(contacts: MeritContact[], searchQuery: string = ''): MeritContact[] {
    searchQuery = searchQuery.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
    const exp = new RegExp(searchQuery, 'ig');
    return contacts.filter((contact: MeritContact) => {
      if (contact.name.formatted && contact.name.formatted.match(exp)) return true;
      if (_.some(contact.emails, (email) => email.value.match(exp))) return true;
      if (_.some(contact.phoneNumbers, (phoneNumber) => phoneNumber.value.match(exp))) return true;
      if (_.some(contact.meritAddresses, (address) => address.address.match(exp))) return true;
      if (_.some(contact.meritAddresses, (address) => address.alias && address.alias.match(exp))) return true;
      return false;
    });
  }

  async getAllMeritContacts(): Promise<MeritContact[]> {
    const deviceContacts: Contact[] = await this.getDeviceContacts();
    const localContacts: IAddressBook = this.addressBook || {};

    const contacts: MeritContact[] = deviceContacts
      .filter((contact: Contact) => !_.isEmpty(contact.displayName) && !_.isEmpty(contact.phoneNumbers) || !_.isEmpty(contact.emails))
      .map((contact: Contact) => createMeritContact(contact));

    let localContact: MeritContact, deviceContact: MeritContact;

    Object.keys(localContacts)
      .forEach((key: string) => {
        localContact = localContacts[key];

        if (localContact.id || localContact.phoneNumbers.length || localContact.emails.length) {
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
  };

  async getAddressbook(network: string = ENV.network): Promise<IAddressBook> {
    const addressBook = await this.persistenceService.getAddressbook(network);
    return _.isEmpty(addressBook) ? {} : addressBook;
  }

  async requestDevicePermission() {
    if (!Diagnostic.installed())
      return false;

    // we have permission, no need to request it again
    if (await this.hasDevicePermission())
      return true;

    // we do not have permission
    const status: string = this.devicePermissionStatus = await this.deviceDiagnosticProvider.requestContactsAuthorization();

    // permission was granted
    if ([this.deviceDiagnosticProvider.permissionStatus.GRANTED, this.deviceDiagnosticProvider.permissionStatus.GRANTED_WHEN_IN_USE].indexOf(status) > -1)
      return this.devicePermissionGranted = true;

    // permission wasn't granted
    return false;
  }

  async getDeviceContacts() {
    if (!await this.hasDevicePermission())
      return [];

    return this.deviceContactsProvider.find(['emails', 'phoneNumbers'], { desiredFields: DESIRED_FIELDS, multiple: true });
  }

  async isDevicePermissionDeclined() {
    await this.init;

    if (this.devicePermissionGranted === true) return true;
    return [this.deviceDiagnosticProvider.permissionStatus.DENIED, this.deviceDiagnosticProvider.permissionStatus.DENIED_ALWAYS].indexOf(this.devicePermissionStatus) > -1;
  }

  private async hasDevicePermission() {
    if (!Diagnostic.installed()) return false;
    return (await this.deviceDiagnosticProvider.getContactsAuthorizationStatus()) === this.deviceDiagnosticProvider.permissionStatus.GRANTED;
  }

}
