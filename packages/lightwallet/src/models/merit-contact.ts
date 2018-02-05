import * as Bitcore from 'bitcore-lib';
import { IContactField, IContactName, IContactProperties } from '@ionic-native/contacts';

export interface IAddressBook {
  [key: string]: MeritContact;
}

export interface IMeritAddress {
  network: string,
  address: string
}

export class MeritContact implements IContactProperties {

  id: string;
  name: IContactName;
  phoneNumbers: IContactField[];
  emails: IContactField[];
  photos: IContactField[];
  urls: Array<any>;
  meritAddresses: Array<IMeritAddress>;

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
      } catch (e) {
      }
    });
  }

}
