import { hasValidEntropy, hasValidWords, isValidSize } from './mnemonic';

describe('Utils.Mnemonic', () => {
  it('12 words mnemonic should be valid size', () => {
    expect(isValidSize('chair sing cool west birth stock disease sniff bulb surround absorb design')).toBeTruthy();
  });

  it('should be valid words', () => {
    expect(hasValidWords('chair sing cool west birth stock disease sniff bulb surround absorb design')).toBeTruthy();
  });

  it('mnemonic should be valid', () => {
    expect(
      hasValidEntropy('miracle tilt alone fresh sustain course awesome holiday fix tuna vital ginger'),
    ).toBeTruthy();
  });

  it('mnemonic should be invalid', () => {
    expect(hasValidEntropy('chair sing cool west birth stock disease sniff bulb surround absorb design')).toBeFalsy();
  });
});
