import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { Contacts, Contact as DeviceContact, IContactProperties } from '@ionic-native/contacts';
import { MeritContact } from 'merit/shared/address-book/merit-contact.model';

@Injectable()
export class MeritContactBuilder {

  constructor(
    private deviceContactsService:Contacts
  ) {
  }


  public build(contact:IContactProperties = {}) {
    let clone = val => val ? JSON.parse(JSON.stringify(val)) : null;

    let created = new MeritContact();

    if (contact instanceof DeviceContact ) {
      created.nativeModel = contact;
    } else if (contact instanceof MeritContact) {
      if (contact.nativeModel) created.nativeModel = contact.nativeModel;
    } else  {
      let deviceContact = this.deviceContactsService.create();
      try {
        //the only way we can check that contact was created properly.
        // if cordova is not available, service returns object with non-working getters
        let check = deviceContact.name;
        created.nativeModel = deviceContact;
      } catch (e) {
        //we are in non-cordova environment, just leaving nativeModel empty
      }
    }

    created.name = clone(contact.name) || {formatted: ''};
    created.phoneNumbers = clone(contact.phoneNumbers) || [];
    created.emails = clone(contact.emails) || [];
    created.photos = clone(contact.photos) || [];
    created.urls   = clone(contact.urls) || [];
    created.id = contact.id;

    return created;
  }

}