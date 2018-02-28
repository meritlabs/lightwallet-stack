export function cleanAddress(address: string) {
  return address.replace(/\s+/g, '');
}

export function isAlias(address: string) {
  return cleanAddress(address).charAt(0) === '@';
}
