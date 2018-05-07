import { MWCService } from '@merit/common/services/mwc.service';
import { Address, Referral } from 'bitcore-lib';

export function cleanAddress(address: string) {
  address = address || '';
  return address.replace(/[@|\s]/g, '');
}

export function invalidPattern(address: string) {
  let na_regEx = /@/g;
  console.log(na_regEx.test(address));

  return na_regEx.test(address);
}

export function isAlias(address: string) {
  address = address || '';
  return address.replace(/\s/g, '').charAt(0) === '@';
}

export function isAddress(address: string, mwcService?: MWCService) {
  try {
    Address.fromString(address);
    return true;
  } catch (_e) {
    return false;
  }
}

export function couldBeAlias(alias: string, mwcService?: MWCService) {
  return Referral.validateAlias(alias);
}

export function getAddressInfo(address: string, mwcService: MWCService) {
  if (isAlias(address)) address = address.slice(1);
  return mwcService.getClient().validateAddress(address);
}
