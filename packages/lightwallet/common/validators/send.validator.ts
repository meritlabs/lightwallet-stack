import { AbstractControl } from '@angular/forms';
import { DisplayWallet } from '@merit/common/models/display-wallet';
import { MWCService } from '@merit/common/services/mwc.service';
import { AddressValidator } from '@merit/common/validators/address.validator';

export class SendValidator {
  static validateWallet(control: AbstractControl) {
    if (!control.value || !(control.value instanceof DisplayWallet)) {
      return {
        InvalidWallet: true
      };
    }

    return null;
  }

  static validateAddress(mwcService: MWCService, allowUnconfirmed?: boolean) {
    return async (control: AbstractControl) => {
      if (control.parent && control.parent.get('type').value === 'easy') return null;

      return AddressValidator.validateAddress(mwcService, allowUnconfirmed)(control);
    };
  }

  static validateAmount(control: AbstractControl) {
    const { value } = control;

    if (typeof value !== 'number' || value <= 0) return { InvalidAmount: true };

    return null;
  }
}
