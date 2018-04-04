import { AbstractControl, ValidationErrors } from '@angular/forms';
import { ConfigService } from '@merit/common/services/config.service';
import { EmailNotificationsService } from '@merit/common/services/email-notification.service';

export class EmailValidator {

  isValid(cnf: ConfigService, eml: EmailNotificationsService): (control: AbstractControl) => ValidationErrors | null {
    console.log(this, cnf, eml);

    return function (control: AbstractControl): ValidationErrors | null {
      let config = cnf.get();
      let latestEmail = eml.getEmailIfEnabled(config);

      let validEmail = (/^[a-zA-Z0-9.!#$%&*+=?^_{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/).test(control.value);
      if (validEmail && control.value != latestEmail) {
        return null;
      }

      return {
        'Invalid Email': true
      };
    }
  }
}
