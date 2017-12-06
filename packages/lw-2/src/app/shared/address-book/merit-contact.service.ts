import * as _ from 'lodash';
import { Injectable } from '@angular/core';
import { Contacts, Contact as DeviceContact, IContactProperties } from '@ionic-native/contacts';
import { MeritContact } from 'merit/shared/address-book/merit-contact.model';
import { AddressBookService } from 'merit/shared/address-book/address-book.service';

/**
 * Creates MeritContact model and injects native contact in it
 */

@Injectable()
export class MeritContactService {

  constructor(
    private addressBookService:AddressBookService
  ) {
  }

  public add(contact:MeritContact):Promise<any> {
    if (!contact.isValid()) {
      return Promise.reject('Contact is not valid');
    }

    if (contact.storeOnDevice) {
      return contact.nativeModel.save();
    } else {
      let address = contact.meritAddresses[0].address;
      let network = contact.meritAddresses[0].network;
      return this.addressBookService.add(contact, address, network);
    }

  }

  public edit(contact:MeritContact):Promise<any> {

    if (!contact.isValid()) {
      return Promise.reject('Contact is not valid');
    }

    let address = contact.meritAddresses[0].address;
    let network = contact.meritAddresses[0].network;
    return this.addressBookService.remove(address, network).then(() => {
      if (contact.storeOnDevice) {
        return contact.nativeModel.save();
      } else {
        return this.addressBookService.add(contact, address, network);
      }
    });
  }


}
