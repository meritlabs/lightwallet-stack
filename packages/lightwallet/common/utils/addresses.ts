import { getMWCInstance, MWCService } from '@merit/common/services/mwc.service';
import { Address, Referral } from 'bitcore-lib';

const aliasRegexp = /^[a-z0-9]([a-z0-9_-]){1,18}[a-z0-9]$/i;
const emailRegexp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const phoneRegexp = /^\+?[0-9]{0,3}[-. ]?\(?[0-9]{3}\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;

export function cleanAddress(address: string) {
  address = address || '';
  return address.replace(/[@|\s]/g, '');
}

export function isAlias(address: string) {
  address = address || '';
  return address.replace(/\s/g, '').charAt(0) === '@';
}

export function isAddress(address: string) {
  try {
    Address.fromString(address);
    return true;
  } catch (_e) {
    return false;
  }
}

export function couldBeAlias(alias: string) {
  return aliasRegexp.test(alias);
}

export function getAddressInfo(address: string) {
  if (isAlias(address)) address = address.slice(1);
  return getMWCInstance().validateAddress(address);
}

export function isEmail(value: string): boolean {
  return emailRegexp.test(value.toLowerCase());
}

export function isPhoneNumber(value: string): boolean {
  return phoneRegexp.test(value);
}
