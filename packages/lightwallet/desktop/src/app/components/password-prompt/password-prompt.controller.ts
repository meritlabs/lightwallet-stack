import { Injectable } from '@angular/core';
import { DisplayWallet } from '@merit/common/models/display-wallet';
import { DOMController } from '@merit/desktop/app/components/dom.controller';
import { PasswordPromptComponent } from '@merit/desktop/app/components/password-prompt/password-prompt.component';

@Injectable()
export class PasswordPromptController {
  constructor(private domCtrl: DOMController) {}

  create(wallet?: DisplayWallet) {
    return this.domCtrl.create(PasswordPromptComponent, { wallet });
  }
}
