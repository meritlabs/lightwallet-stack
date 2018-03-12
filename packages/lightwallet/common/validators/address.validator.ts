import { AbstractControl } from '@angular/forms';
import { MWCService } from '@merit/common/services/mwc.service';

export class AddressValidator {
  static validateAddressOrAlias(mwcService: MWCService) {
    return (input: AbstractControl) => {

    };
  }

  static validateAddress() {

  }
}
