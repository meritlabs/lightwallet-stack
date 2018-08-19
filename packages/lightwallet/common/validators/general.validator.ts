import { AbstractControl } from '@angular/forms';
import { validateEmail, validatePhoneNumber } from '@merit/common/utils/destination';

export class GeneralValidator {
  static validateEmail(control: AbstractControl) {
    if (!validateEmail(control.value)) {
      return {
        InvalidEmail: true
      };
    }
  }

  static validatePhoneNumber(control: AbstractControl) {
    if (!validatePhoneNumber(control.value)) {
      return {
        InvalidPhoneNumber: true
      };
    }
  }
}
