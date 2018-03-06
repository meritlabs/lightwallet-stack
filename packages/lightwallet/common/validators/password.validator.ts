import { AbstractControl } from '@angular/forms';

export class PasswordValidator {
  static MatchPassword(control: AbstractControl) {
    const password = control.get('password').value,
      repeatPassword = control.get('repeatPassword').value;

    if (password != repeatPassword) {
      control.get('repeatPassword').setErrors({ PasswordMatch: true });
    }

    return true;
  }
}
