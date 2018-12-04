import { AbstractControl, ValidationErrors } from '@angular/forms';
import { ConfigService } from '@merit/common/services/config.service';
import { EmailNotificationsService } from '@merit/common/services/email-notification.service';

export class EmailValidator {
  static isValidEmail(control: AbstractControl) {
    const validEmail = /^[a-zA-Z0-9.!#$%&*+=?^_{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(control.value);

    if (!validEmail) {
      return {
        InvalidEmail: true,
      };
    }

    return null;
  }

  static isValid(
    cnf: ConfigService,
    eml: EmailNotificationsService,
  ): (control: AbstractControl) => ValidationErrors | null {
    return function(control: AbstractControl): ValidationErrors | null {
      const config = cnf.get();
      const latestEmail = eml.getEmailIfEnabled(config);

      const validEmail = /^[a-zA-Z0-9.!#$%&*+=?^_{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(control.value);
      if (validEmail && control.value != latestEmail) {
        return null;
      }

      return {
        'Invalid Email': true,
      };
    };
  }
}
