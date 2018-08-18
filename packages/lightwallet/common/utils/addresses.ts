import { getMWCInstance } from '@merit/common/services/mwc.service';
import { Address, Referral } from 'bitcore-lib';

const aliasRegexp = /^[a-z0-9]([a-z0-9_-]){1,18}[a-z0-9]$/i;

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
