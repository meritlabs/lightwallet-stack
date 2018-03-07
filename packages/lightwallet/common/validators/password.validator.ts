import { AbstractControl } from '@angular/forms';

export class PasswordValidator {
  static MatchPassword(control: AbstractControl) {
    try {
      const password = control.parent.get('password').value,
        repeatPassword = control.value;

      if (password != repeatPassword) {
        control.get('repeatPassword').setErrors({ PasswordMatch: true });
      }
    } catch (e) {}

    return true;
  }
}
