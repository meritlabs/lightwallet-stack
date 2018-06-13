import { Injectable } from '@angular/core';
import { DOMController } from '@merit/desktop/app/components/dom.controller';
import { SmsNotificationsPromptComponent } from '@merit/desktop/app/core/components/sms-notifications-prompt/sms-notifications-prompt.component';

@Injectable()
export class SmsNotificationsPromptController {
  constructor(private domCtrl: DOMController) {}

  create() {
    return this.domCtrl.create(SmsNotificationsPromptComponent, {});
  }
}
