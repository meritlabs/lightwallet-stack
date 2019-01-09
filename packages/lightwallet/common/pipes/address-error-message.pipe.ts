import { Pipe } from '@angular/core';

@Pipe({
  name: 'addressErrorMessage',
})
export class AddressErrorMessagePipe {
  transform(value: any) {
    if (!value) return;

    if (value.required) return 'Address or alias is required';

    if (value.minlength) return 'Address or alias must be at least 3 characters long';

    if (value.InvalidFormat) return 'Invalid address format';

    if (value.AddressNotFound) return 'Address or alias not found';

    console.error('Unhandled address error: ', value);
    return 'Unknown error';
  }
}
