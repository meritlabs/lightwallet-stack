import { SendMethodDestination } from '@merit/common/models/send-method';

const emailRegexp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const phoneRegexp = /^\+?[0-9]{0,3}[-. ]?\(?[0-9]{3}\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;

export function validateEmail(email: string) {
  email = email || '';
  return emailRegexp.test(String(email).trim().toLowerCase());
}

export function validatePhoneNumber(phoneNumber: string) {
  phoneNumber = phoneNumber || '';
  return phoneRegexp.test(phoneNumber);
}

export function getSendMethodDestinationType(destination: string): SendMethodDestination {
  if (validateEmail(destination)) return SendMethodDestination.Email;
  if (validatePhoneNumber(destination)) return SendMethodDestination.Sms;
  return null;
}
