import * as _ from 'lodash';
import * as Promise from 'bluebird';
import { Injectable } from '@angular/core';
import { Contacts, Contact as DeviceContact, IContactProperties, IContactField } from '@ionic-native/contacts';
import { MeritContact } from 'merit/shared/address-book/merit-contact.model';
import { AddressBookService } from 'merit/shared/address-book/address-book.service';
import { BwcService } from 'merit/core/bwc.service';
import { Logger } from 'merit/core/logger';

/**
 * Creates MeritContact model and injects native contact in it
 */

@Injectable()
export class MeritContactService {
  private bitcore;

  constructor(
    private addressBookService:AddressBookService,
    private bwcService: BwcService,
    private logger: Logger
  ) {
    this.bitcore = bwcService.getBitcore();
  }

  private updateModel(contact: MeritContact) {

    contact.nativeModel.name = contact.name;
    contact.nativeModel.emails = contact.emails;
    contact.nativeModel.phoneNumbers = contact.phoneNumbers;
    contact.nativeModel.urls = contact.urls;
  }

  public add(contact:MeritContact):Promise<any> {
    if (!contact.isValid()) {
      return Promise.reject('Contact is not valid');
    }

    if (contact.storeOnDevice) {
      this.updateURLs(contact);
      this.updateModel(contact);
      return Promise.resolve(contact.nativeModel.save());
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
        this.updateURLs(contact);
        this.updateModel(contact);
        this.logger.info('attempting to save contact to device');
        this.logger.info(contact.nativeModel);
        return Promise.resolve(contact.nativeModel.save());
      } else {
        return this.addressBookService.add(contact, address, network);
      }
    });
  }

  private updateURLs(contact:MeritContact) {
    if(_.isEmpty(contact.meritAddresses)) return contact;
    let address = _.head(contact.meritAddresses).address;
    let network = _.head(contact.meritAddresses).network || this.bitcore.Address.fromString(address).network;
    let urlObj = {
      type: 'other',
      value: `merit:${address}:${network}`
    }
    for(let i = 0; i < contact.urls.length; i++) {
      if(contact.urls[i].value.indexOf('merit:') == 0) {
        this.logger.info('replacing url with')
        this.logger.info(urlObj)
        contact.urls[i] = urlObj;
        return contact;
      }
    }
    this.logger.info('inserting url with')
    this.logger.info(urlObj)
    contact.urls.push(urlObj);
    return contact;
  }

}
