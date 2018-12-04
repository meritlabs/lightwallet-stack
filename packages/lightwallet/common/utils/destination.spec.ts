import { SendMethodDestination } from '@merit/common/models/send-method';
import { getSendMethodDestinationType, validateEmail, validatePhoneNumber } from '@merit/common/utils/destination';

describe('[Validators] Destination', () => {
  it('should validate email', () => {
    expect(validateEmail('hello@merit.me')).toBeTruthy();
  });

  it('should return type as email', () => {
    expect(getSendMethodDestinationType('hello@merit.me')).toBe(SendMethodDestination.Email);
  });

  it('should validate phone number', () => {
    expect(validatePhoneNumber('8444169972')).toBeTruthy();
  });

  it('should return type as SMS', () => {
    expect(getSendMethodDestinationType('8444169972')).toBe(SendMethodDestination.Sms);
  });

  it("should return type as null if it's not a phone number or email", () => {
    expect(getSendMethodDestinationType('definitely nothing valid')).toBeFalsy();
  });
});
