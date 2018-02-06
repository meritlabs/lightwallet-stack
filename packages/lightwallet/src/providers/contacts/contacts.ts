import { Injectable } from '@angular/core';
import { Contacts } from '@ionic-native/contacts';
import { Diagnostic } from '@ionic-native/diagnostic';

const DESIRED_FIELDS = [
  'displayName',
  'emails',
  'name',
  'phoneNumbers',
  'photos'
];

// TODO merge with AddressBook Service

@Injectable()
export class ContactsProvider {

  private permissionGranted: boolean;
  private permissionStatus: string;

  constructor(private contacts: Contacts,
              private diagnostic: Diagnostic) {
    this.init();
  }

  async init() {
    this.permissionGranted = await this.hasPermission();

    if (!this.permissionGranted && Diagnostic.installed()) {
      this.permissionStatus = await this.diagnostic.getContactsAuthorizationStatus();
    }
  }

  async requestPermission() {
    if (!Diagnostic.installed())
      return false;

    // we have permission, no need to request it again
    if (await this.hasPermission())
      return true;

    // we do not have permission
    const status: string = this.permissionStatus = await this.diagnostic.requestContactsAuthorization();

    // permission was granted
    if ([this.diagnostic.permissionStatus.GRANTED, this.diagnostic.permissionStatus.GRANTED_WHEN_IN_USE].indexOf(status) > -1)
      return this.permissionGranted = true;

    console.log(status);

    // permission wasn't granted
    return false;
  }

  async getContactByPhoneNumber(phoneNumber: string) {
    if (!await this.requestPermission())
      return null;

    return this.contacts.find(['phoneNumbers'], {
      hasPhoneNumber: true,
      filter: phoneNumber,
      desiredFields: DESIRED_FIELDS,
      multiple: true
    });
  }

  async getContactByEmail(emailAddress: string) {
    if (!await this.requestPermission())
      return null;

    return this.contacts.find(['emails'], {
      hasPhoneNumber: true,
      filter: emailAddress,
      desiredFields: DESIRED_FIELDS,
      multiple: true
    });
  }

  async getAllContacts() {
    if (!await this.requestPermission())
      return [];

    return this.contacts.find(['emails', 'phoneNumbers'], { desiredFields: DESIRED_FIELDS, multiple: true });
  }

  private async hasPermission() {
    if (!Diagnostic.installed()) return false;
    return await this.diagnostic.isContactsAuthorized();
  }

}
