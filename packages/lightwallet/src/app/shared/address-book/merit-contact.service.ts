import { Injectable } from '@angular/core';
import { BwcService } from 'merit/core/bwc.service';
import { Logger } from 'merit/core/logger';
import { AddressBookService } from 'merit/shared/address-book/address-book.service';
import { MeritContact } from 'merit/shared/address-book/merit-contact.model';


/**
 * Creates MeritContact model and injects native contact in it
 */

@Injectable()
export class MeritContactService {
  private bitcore;

  constructor(private addressBookService: AddressBookService,
              private bwcService: BwcService,
              private logger: Logger) {
    this.bitcore = bwcService.getBitcore();
  }

  public add(contact: MeritContact): Promise<any> {
    if (!contact.isValid()) {
      return Promise.reject(new Error('Contact is not valid'));
    }

    let address = contact.meritAddresses[0].address;
    let network = contact.meritAddresses[0].network;
    return this.addressBookService.add(contact, address, network);

  }

  public edit(contact: MeritContact): Promise<any> {

    if (!contact.isValid()) {
      return Promise.reject(new Error('Contact is not valid'));
    }

    let address = contact.meritAddresses[0].address;
    let network = contact.meritAddresses[0].network;
    return this.addressBookService.remove(address, network).then(() => {
      this.updateModel(contact);
      return this.addressBookService.add(contact, address, network);
    });
  }

  public remove(contact: MeritContact): Promise<any> {
    let address = contact.meritAddresses[0].address;
    let network = contact.meritAddresses[0].network;
    return this.addressBookService.remove(address, network);
  }

  private updateModel(contact: MeritContact) {

    contact.nativeModel.name = contact.name;
    contact.nativeModel.emails = contact.emails;
    contact.nativeModel.phoneNumbers = contact.phoneNumbers;
    contact.nativeModel.urls = contact.urls;
  }

}
