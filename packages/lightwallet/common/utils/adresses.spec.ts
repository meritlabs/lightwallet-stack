import { isAddress } from '@merit/common/utils/addresses';

describe('Utils.Addresses', () => {
  it('address should be valid', () => {
    expect(isAddress('MMxfPZDX9m6Eb9rFNSVDktx3YKmpJ7cRJS')).toBeTruthy();
  });

  it('address should be invalid', () => {
    expect(isAddress('DefinitelyNotAnAddress')).toBeFalsy();
  });
});
