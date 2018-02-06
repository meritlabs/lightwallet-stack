import { IContactProperties } from '@ionic-native/contacts';

export function getContactInitials(contact: IContactProperties) {
  if (!contact.name || !contact.name.formatted) return '';
  const nameParts = contact.name.formatted.toUpperCase().replace(/\s\s+/g, ' ').split(' ');
  let name = nameParts[0].charAt(0);
  if (nameParts[1]) name += ' ' + nameParts[1].charAt(0);
  return name;
}
