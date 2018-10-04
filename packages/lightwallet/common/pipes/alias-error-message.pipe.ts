import { Pipe } from '@angular/core';

@Pipe({
  name: 'aliasErrorMessage'
})
export class AliasErrorMessagePipe {
  transform(value: any) {
    if (!value) return;

    if (value.required)
      return 'Alias is required';

    if (value.minlength)
      return 'Alias must be at least 3 characters long';

    if (value.InvalidFormat)
      return 'Invalid alias format';

    if (value.AliasInUse)
      return 'Alias is already in use';

    console.error('Unhandled alias error: ', value);
    return 'Unknown error';
  }
}
