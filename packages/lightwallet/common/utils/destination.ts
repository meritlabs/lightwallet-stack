import { SendMethodDestination } from '@merit/common/models/send-method';

const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export function validateEmail(email: string) {
  email = email || '';
  return EMAIL_REGEX.test(
    String(email)
      .trim()
      .toLowerCase(),
  );
}

export function validatePhoneNumber(phoneNumber: string) {
  phoneNumber = phoneNumber || '';
  return phoneNumber.replace(/\D+/g, '').length >= 10;
}

export function getSendMethodDestinationType(destination: string): SendMethodDestination {
  if (validateEmail(destination)) return SendMethodDestination.Email;
  if (validatePhoneNumber(destination)) return SendMethodDestination.Sms;
  return null;
}
