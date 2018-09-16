import { AbstractControl } from '@angular/forms';
import { DisplayWallet } from '@merit/common/models/display-wallet';

export class InviteValidator {

  static InviteQuantityValidator(control: AbstractControl) {
    try {
      const wallet: DisplayWallet = control.parent.get('wallet').value;
      if (control.value > wallet.balance.spendableInvites) {
        return { NotEnoughInvites: true };
      }
    } catch (e) {
      return null;
    }
  }
}
