import { IContactProperties } from '@ionic-native/contacts';
import { MeritContact } from '../models/merit-contact';
import { clone, isEmpty } from 'lodash';

export function getContactInitials(contact: IContactProperties) {
  if (!contact.name || !contact.name.formatted) return '';
  const nameParts = contact.name.formatted
    .toUpperCase()
    .replace(/\s\s+/g, ' ')
    .split(' ');
  let name = nameParts[0].charAt(0);
  if (nameParts[1]) name += '' + nameParts[1].charAt(0);
  return name;
}

export function createMeritContact(contact: Partial<IContactProperties>): MeritContact {
  const meritContact: MeritContact = new MeritContact();

  meritContact.id = contact.id || `merit-${new Date().getUTCMilliseconds()}`;
  meritContact.name = clone(contact.name) || { formatted: '' };
  meritContact.phoneNumbers = clone(contact.phoneNumbers) || [];
  meritContact.emails = clone(contact.emails) || [];
  meritContact.photos = clone(contact.photos) || [];
  meritContact.meritAddresses = isEmpty(contact['meritAddresses']) ? [] : clone(contact['meritAddresses']);

  return meritContact;
}
