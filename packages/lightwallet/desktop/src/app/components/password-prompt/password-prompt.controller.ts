import { Injectable } from '@angular/core';
import { AsyncValidatorFn, ValidatorFn, Validators } from '@angular/forms';
import { DisplayWallet } from '@merit/common/models/display-wallet';
import { PasswordValidator } from '@merit/common/validators/password.validator';
import { DOMController } from '@merit/desktop/app/components/dom.controller';
import { PasswordPromptComponent } from '@merit/desktop/app/components/password-prompt/password-prompt.component';

@Injectable()
export class PasswordPromptController {
  constructor(private domCtrl: DOMController) {}

  create(title: string, validators: ValidatorFn[] = [Validators.required], asyncValidators: AsyncValidatorFn[] = []) {
    return this.domCtrl.create(PasswordPromptComponent, { title, validators, asyncValidators });
  }

  createForWallet(wallet?: DisplayWallet) {
    const validators: ValidatorFn[] = [Validators.required];

    if (wallet) {
      validators.push(PasswordValidator.VerifyWalletPassword(wallet.client));
    }

    return this.create('Enter wallet password', validators);
  }
}
