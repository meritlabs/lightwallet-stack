import { formatAmount } from './format';

describe('Utils.Format', () => {
  it('should throw an error when an invalid unit is passed', () => {
    try {
      formatAmount(1234, 'merit');
    } catch (err) {
      expect(err.message).toBe('Invalid unit');
    }
  });

  it('should format 10000000 micros to 1.00MRT', () => {
    expect(formatAmount(100000000, 'mrt')).toBe('1.00');
  });
});
