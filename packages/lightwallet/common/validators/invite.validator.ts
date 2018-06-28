import { AbstractControl } from '@angular/forms';
import { MWCService } from '@merit/common/services/mwc.service';

export class InviteValidator {
  static validateInviteQuantity(mwcService: MWCService, allowUnconfirmed?: boolean): Promise<any> {
    return new Promise((resolve, reject) => {
      return (abstractCtrl: AbstractControl) => {
        let { value } = abstractCtrl;

        if (!value)
          return resolve({ required: true });

        mwcService.getClient().invitesBalance.then((balance) => {
          if (value >= balance.availableAmount -1) {
            return resolve({ InvalidAmount: true });
          }
        });  
      }
    });
  }
}
