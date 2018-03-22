import { AbstractControl, ValidatorFn } from '@angular/forms';
import { MeritWalletClient } from '@merit/common/merit-wallet-client';

export class PasswordValidator {
  static MatchPassword(control: AbstractControl) {
    try {
      const password = control.parent.get('password').value,
        repeatPassword = control.value;

      if (password != repeatPassword) {
        return { PasswordMatch: true };
      }
    } catch (e) {}
  }

  static VerifyWalletPassword(wallet: MeritWalletClient): ValidatorFn {
    return (control: AbstractControl) => wallet.checkPassword(control.value)? null : { IncorrectPassword: true };
  }
}
