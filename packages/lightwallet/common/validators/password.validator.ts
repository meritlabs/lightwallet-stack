import { AbstractControl, AsyncValidatorFn, ValidatorFn } from '@angular/forms';
import { MeritWalletClient } from '@merit/common/merit-wallet-client';
import { EasyReceipt } from '@merit/common/models/easy-receipt';
import { EasyReceiveService } from '@merit/common/services/easy-receive.service';

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
    return (control: AbstractControl) => (wallet.checkPassword(control.value) ? null : { IncorrectPassword: true });
  }

  static ValidateEasyReceivePassword(receipt: EasyReceipt, easyReceiveService: EasyReceiveService): AsyncValidatorFn {
    return async (control: AbstractControl) => {
      const { txs } = await easyReceiveService.validateEasyReceiptOnBlockchain(receipt, control.value);
      if (!txs || !txs.length) {
        return {
          IncorrectPassword: true,
        };
      }
    };
  }
}
