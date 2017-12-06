import * as _ from 'lodash';
let Bitcore = require('bitcore-lib');

import { Contact, IContactProperties, IContactName, IContactField } from '@ionic-native/contacts';
export interface AddressBook { [key:string]:MeritContact; }

export interface IMeritAddress {network:string, address:string}

export class MeritContact implements IContactProperties {

  public name: IContactName = {formatted: ''};
  public phoneNumbers: IContactField[] = [];
  public emails: IContactField[] = [];
  public photos: IContactField[] = [];
  public urls: Array<any> = [];
  public meritAddresses:Array<IMeritAddress> = [];

  public storeOnDevice:boolean = false;
  public nativeModel:Contact;

  isValid() {
    if (!this.name) return false;
    if (!this.meritAddresses.length) return false;
    let isValid = true;
    this.meritAddresses.forEach((address) => {
      if (!address.network) {
        isValid = false
      } else {
        if (!Bitcore.Address.isValid(address.address)) isValid = false;
      }
    });
    return isValid;
  }

  formatAddress() {
    this.meritAddresses.forEach((val) => {
      if (val.address.indexOf('merit:') == 0) val.address = val.address.split(':')[1];
      try {
        val.network = Bitcore.Address.fromString(val.address).network.name;
        console.log('set network!', val.network);
      } catch (e) { }
    });

    this.urls = this.urls.filter((url) => url.value.indexOf('merit') == -1);
    this.meritAddresses.forEach((address) => {
      this.urls.push({value: 'merit:'+address.address+':'+address.network, type: 'other', pref: false, id: 1})
    })
  }

}