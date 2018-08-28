import { AbstractControl } from '@angular/forms';
import { DisplayWallet } from '@merit/common/models/display-wallet';
import { MWCService } from '@merit/common/services/mwc.service';
import { validateEmail, validatePhoneNumber } from '@merit/common/utils/destination';
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

  static validateMaximumAvailable(control: AbstractControl) {
    const wallet:DisplayWallet = control.parent.get("wallet").value;

    try {
      if (control.value > wallet.balance.spendableAmount) {
        return { NotEnoughMRT: true } 
      } 
    } catch (e) {
      return null;
    }
  }


  static validateGlobalSendDestination(control: AbstractControl) {
    const { value } = control;

    if (control.parent && control.parent.get('type').value === 'classic')
      return null;

    if (!value || value.trim() == '')
      return null;

    if (!validatePhoneNumber(value) && !validateEmail(value))
      return {
        InvalidDestination: true
      };

    // validate email / phone number

    return null;
  }

  static isEmail(value) {   
    return validateEmail(value)  
  }
}
