import { FormControl } from '@angular/forms';
import { EmailNotificationsService } from '@merit/mobile/app/core/notification/email-notification.service';
import { ConfigService } from '@merit/mobile/app/shared/config.service';

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
      'Invalid Email': true
    };
  }
}
