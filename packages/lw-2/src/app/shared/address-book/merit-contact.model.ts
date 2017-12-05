let Bitcore = require('bitcore-lib');

import { Contact, IContactProperties, IContactName, IContactField } from '@ionic-native/contacts';
export interface AddressBook { [key:string]:MeritContact; }


export class MeritContact implements IContactProperties {

  public name: IContactName;
  public phoneNumbers: IContactField[];
  public emails: IContactField[];
  public photos: IContactField[];
  public urls: IContactField[];

  public meritAddresses:Array<{network:string, address:string}> = [];

  public storeOnDevice:boolean;

  public nativeModel:Contact;

  isValid() {

    if (!this.name) return false;
    if (!this.meritAddresses.length) return false;
    let isValid = true;
    this.meritAddresses.forEach((address) => {
      if (!Bitcore.Address.isValid(address.address)) isValid = false;
    });
    return isValid;
  }

  constructor(nativeContact:Contact) {

    if (nativeContact) {
      this.nativeModel = nativeContact;
      this.storeOnDevice = true;
    } else {
      nativeContact = new Contact();
      this.storeOnDevice = false;
    }

    this.name = nativeContact.name || {formatted: ''};
    this.phoneNumbers =  nativeContact.phoneNumbers || [];
    this.emails = nativeContact.emails || [];
    this.photos = nativeContact.photos || [];
    this.urls   = nativeContact.urls   || [];
    this.urls.forEach((url) => {
      if (url.value.indexOf('merit:') == 0) {
        let address = url.type.split(':')[1];
        let network = url.type.split(':')[2];
        this.meritAddresses.push({network: network, address: address});
      }
    });

  }

}