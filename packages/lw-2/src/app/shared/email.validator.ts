import { FormControl } from '@angular/forms';
import { ConfigService } from 'merit/shared/config.service';
import { EmailNotificationsService } from 'merit/core/email-notification.service';

export class EmailValidator {

  static cnf: ConfigService;
  static eml: EmailNotificationsService;

  constructor(cnf: ConfigService, eml: EmailNotificationsService) {
    EmailValidator.cnf = cnf;
    EmailValidator.eml = eml;
  }

  isValid(control: FormControl): any {

    let config = EmailValidator.cnf.get();
    let latestEmail = EmailValidator.eml.getEmailIfEnabled(config);

    let validEmail = (/^[a-zA-Z0-9.!#$%&*+=?^_{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/).test(control.value);
    if (validEmail && control.value != latestEmail) {
      return null;
    }

    return {
      "Invalid Email": true
    };
  }
}
