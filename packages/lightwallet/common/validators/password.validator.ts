import { AbstractControl } from '@angular/forms';
import { ValidationErrors } from '@angular/forms/src/directives/validators';

export class PasswordValidator {
  static MatchPassword(control: AbstractControl): ValidationErrors | null {
    try {
      const password = control.parent.get('password').value,
        repeatPassword = control.value;

      if (password != repeatPassword) {
        return {
          PasswordMatch: true
        };
      }
    } catch (e) {}
  }
}
