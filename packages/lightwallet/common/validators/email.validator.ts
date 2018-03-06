import { AbstractControl, ValidationErrors } from '@angular/forms';
import { ConfigService } from '@merit/common/services/config.service';
import { EmailNotificationsService } from '@merit/mobile/app/core/notification/email-notification.service';

export class EmailValidator {

  constructor(private cnf: ConfigService, private eml: EmailNotificationsService) {}

  isValid(control: AbstractControl): ValidationErrors | null {
    let config = this.cnf.get();
    let latestEmail = this.eml.getEmailIfEnabled(config);

    let validEmail = (/^[a-zA-Z0-9.!#$%&*+=?^_{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/).test(control.value);
    if (validEmail && control.value != latestEmail) {
      return null;
    }

    return {
      'Invalid Email': true
    };
  }
}
