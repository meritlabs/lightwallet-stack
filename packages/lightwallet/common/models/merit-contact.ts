import { IContactField, IContactName, IContactProperties } from '@ionic-native/contacts';
import { Address } from 'meritcore-lib';

export interface IAddressBook {
  [key: string]: MeritContact;
}

export interface IMeritAddress {
  network: string,
  address: string,
  alias?: string
}

export class MeritContact implements IContactProperties {

  id: string;
  name: IContactName = { formatted: '' };
  phoneNumbers: IContactField[] = [];
  emails: IContactField[] = [];
  photos: IContactField[] = [];
  urls: Array<any> = [];
  meritAddresses: Array<IMeritAddress> = [];

  isValid() {
    if (!this.name) return false;
    if (!this.meritAddresses.length) return false;
    let isValid = true;
    this.meritAddresses.forEach((address) => {
      if (!address.network) {
        isValid = false;
      } else {
        if (!Address.isValid(address.address)) isValid = false;
      }
    });
    return isValid;
  }

  formatAddress() {
    this.meritAddresses.forEach((val) => {
      if (val.address.indexOf('merit:') == 0) val.address = val.address.split(':')[1];
      try {
        val.network = Address.fromString(val.address).network.name;
      } catch (e) {
      }
    });
  }

}
