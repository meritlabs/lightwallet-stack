import { MWCService } from '@merit/common/services/mwc.service';

export function cleanAddress(address: string) {
  return address.replace(/\s+/g, '');
}

export function isAlias(address: string) {
  return cleanAddress(address).charAt(0) === '@';
}

export function isAddress(address: string, mwcService: MWCService) {
  try {
    mwcService.getBitcore().Address.fromString(address);
    return true;
  } catch (e) {
    return false;
  }
}

export function couldBeAlias(alias: string, mwcService: MWCService) {
  return mwcService.getBitcore().Referral.validateAddress(alias);
}

export function getAddressInfo(address: string, mwcService: MWCService) {
  if (isAlias(address)) address = address.slice(1);
  return mwcService.getClient().validateAddress(address);
}
