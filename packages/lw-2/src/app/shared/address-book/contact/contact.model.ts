import * as _ from 'lodash';
let Bitcore = require('bitcore-lib');


export interface AddressBook { [key:string]:MeritContact; }

export interface Searchable { searchTerm: string }
export interface MeritContact extends Searchable {
  name:string;
  email:string;
  phoneNumber:string;
  meritAddress:string;
  sendMethod:string;
}

export let isValidMeritContact = (contact: MeritContact): boolean => {

  let isAddressValid = (address) => {
    return (!_.isEmpty(address) && Bitcore.Address.isValid(address));
  };

  return (isAddressValid(contact.meritAddress) && !_.isEmpty(contact.name));

};

export let emptyMeritContact = (): MeritContact => {
  return ({
    name: '',
    phoneNumber: '',
    email: '',
    meritAddress: '',
    searchTerm: '',
    sendMethod: ''
  });
};