export interface AddressBook { [key:string]:MeritContact; } 
export interface MeritContact {
  name:string;
  email:string;
  phoneNumber:string;
  meritAddress:string;
}

export let isValidMeritContact = (contact: MeritContact): boolean => {
  // TODO: implement
  return true;
}

export let emptyMeritContact = (): MeritContact => {
  return ({
    name: '',
    phoneNumber: '',
    email: '',
    meritAddress: ''
  });
}