import { AbstractControl } from '@angular/forms';
import { DisplayWallet } from '@merit/common/models/display-wallet';

export class SendValidator {
  static validateWallet(control: AbstractControl) {
    if (!control.value || !(control.value instanceof DisplayWallet)) {
      return {
        InvalidWallet: true
      };
    }

    return null;
  }

  static validateAddressRequirement(control: AbstractControl) {
    if (!control.value && control.parent && control.parent.get('type').value === 'classic') {
      return {
        required: true
      };
    }

    return null;
  }
}
