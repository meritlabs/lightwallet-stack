import { AbstractControl } from '@angular/forms';
import { cleanAddress, couldBeAlias, getAddressInfo, isAddress } from '@merit/common/utils/addresses';

export class AddressValidator {
  static validateAddress(allowUnconfirmed?: boolean) {
    return async (abstractCtrl: AbstractControl) => {
      let { value } = abstractCtrl;

      if (!value)
        return { required: true };

      value = cleanAddress(value);

      if (value.length < 3)
        return { minlength: true };

      if (!isAddress(value) && !couldBeAlias(value))
        return { InvalidFormat: true };

      const addressInfo = await getAddressInfo(value);

      if (!addressInfo || !addressInfo.isValid || !addressInfo.isBeaconed || (!allowUnconfirmed && !addressInfo.isConfirmed))
        return { AddressNotFound: true };
    };
  }

  static async validateAliasAvailability(abstractCtrl: AbstractControl) {
    let { value } = abstractCtrl;

    if (!value)
      return null;

    value = cleanAddress(value);

    if (!couldBeAlias(value))
      return { InvalidFormat: true };

    const addressInfo = await getAddressInfo(value);

    if (addressInfo && addressInfo.isConfirmed)
      return { AliasInUse: true };
  }
}
