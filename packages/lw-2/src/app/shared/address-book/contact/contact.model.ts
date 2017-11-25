import * as _ from 'lodash';

export interface AddressBook { [key:string]:MeritContact; } 
export interface MeritContact {
  name:string;
  email:string;
  phoneNumber:string;
  meritAddress:string;
}

export let isValidMeritContact = (contact: MeritContact): boolean => {
  // TODO: implement
  return !(_.isEmpty(contact.meritAddress)  || _.isEmpty(contact.name));
}

export let emptyMeritContact = (): MeritContact => {
  return ({
    name: '',
    phoneNumber: '',
    email: '',
    meritAddress: ''
  });
}