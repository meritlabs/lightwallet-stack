import { AbstractControl } from '@angular/forms';
import { MWCService } from '@merit/common/services/mwc.service';
import { cleanAddress, couldBeAlias, getAddressInfo, isAddress, invalidPattern } from '@merit/common/utils/addresses';

export class AddressValidator {
  static validateAddress(mwcService: MWCService, allowUnconfirmed?: boolean) {
    return async (abstractCtrl: AbstractControl) => {
      let { value } = abstractCtrl;

      if (!value)
        return { required: true };

      if (value.length < 3)
        return { minlength: true };

      if (invalidPattern(value) || !isAddress(value) && !couldBeAlias(value))
        return { InvalidFormat: true };

      const addressInfo = await getAddressInfo(value, mwcService);

      if (!addressInfo || !addressInfo.isValid || !addressInfo.isBeaconed || (!allowUnconfirmed && !addressInfo.isConfirmed))
        return { AddressNotFound: true };
    };
  }

  static validateAliasAvailability(mwcService: MWCService) {
    return async (abstractCtrl: AbstractControl) => {
      let { value } = abstractCtrl;

      if (!value)
        return null;

      if (invalidPattern(value) || !couldBeAlias(value))
        return { InvalidFormat: true };

      const addressInfo = await getAddressInfo(value, mwcService);

      if (addressInfo && addressInfo.isConfirmed)
        return { AliasInUse: true };
    };
  }
}
