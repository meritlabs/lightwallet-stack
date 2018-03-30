import { AbstractControl } from '@angular/forms';
import { MWCService } from '@merit/common/services/mwc.service';
import { couldBeAlias, getAddressInfo, isAddress } from '@merit/common/utils/addresses';

export class AddressValidator {
  static validateAddress(mwcService: MWCService) {
    return async (abstractCtrl: AbstractControl) => {
      const { value } = abstractCtrl;

      if (!isAddress(value) && !couldBeAlias(value))
        return { InvalidFormat: true };

      const addressInfo = await getAddressInfo(value, mwcService);

      if (!addressInfo || !addressInfo.isValid || !addressInfo.isBeaconed || !addressInfo.isConfirmed)
        return { AddressNotFound: true };
    };
  }

  static validateAliasAvailability(mwcService: MWCService) {
    return async (abstractCtrl: AbstractControl) => {
      const { value } = abstractCtrl;

      if (!couldBeAlias(value))
        return { InvalidFormat: true };

      const addressInfo = await getAddressInfo(value, mwcService);

      if (addressInfo && addressInfo.isConfirmed)
        return { AliasInUse: true };
    };
  }
}
