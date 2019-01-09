import { AbstractControl } from '@angular/forms';
import { EmailValidator } from './email.validator';

describe('Validators.Email', () => {
  it('should validate email', () => {
    expect(EmailValidator.isValidEmail({ value: 'valid@email.com' } as AbstractControl)).toBe(null);
    expect(EmailValidator.isValidEmail({ value: 'definitelyNotAValidEmail' } as AbstractControl)).toHaveProperty(
      'InvalidEmail',
    );
  });
});
