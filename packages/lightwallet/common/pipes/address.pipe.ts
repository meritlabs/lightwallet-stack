import { Pipe } from '@angular/core';
import { cleanAddress, isAddress, isAlias } from '@merit/common/utils/addresses';

@Pipe({
  name: 'address',
})
export class AddressPipe {
  transform(value: string, maxAddressLength?: number, showEllipsis?: boolean) {
    if (!value) return null;

    value = cleanAddress(value);

    // isAlias call is cheap, so we can try that first
    if (isAlias(value) || !isAddress(value)) {
      return '@' + value;
    } else {
      if (maxAddressLength) {
        value = value.slice(0, maxAddressLength);

        if (showEllipsis) {
          value += '...';
        }
      }
    }

    return value;
  }
}
