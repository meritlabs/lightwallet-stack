import { AbstractControl } from '@angular/forms';
import { MWCService } from '@merit/common/services/mwc.service';
import { cleanAddress, couldBeAlias, getAddressInfo, isAddress } from '@merit/common/utils/addresses';

export class AddressValidator {
  static validateAddress(mwcService: MWCService, allowUnconfirmed?: boolean) {
    return async (abstractCtrl: AbstractControl) => {
      let { value } = abstractCtrl;

      if (!value) return { required: true };

      value = cleanAddress(value);

      if (value.length < 3) return { minlength: true };

      if (!isAddress(value) && !couldBeAlias(value)) return { InvalidFormat: true };

      const addressInfo = await getAddressInfo(value, mwcService);

      if (
        !addressInfo ||
        !addressInfo.isValid ||
        !addressInfo.isBeaconed ||
        (!allowUnconfirmed && !addressInfo.isConfirmed)
      )
        return { AddressNotFound: true };
    };
  }

  static validateAliasAvailability(mwcService: MWCService) {
    return async (abstractCtrl: AbstractControl) => {
      let { value } = abstractCtrl;

      if (!value) return null;

      value = cleanAddress(value);

      if (!couldBeAlias(value)) return { InvalidFormat: true };

      const addressInfo = await getAddressInfo(value, mwcService);

      if (addressInfo && addressInfo.isConfirmed) return { AliasInUse: true };
    };
  }
}
