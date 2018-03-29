import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DisplayWallet } from '@merit/common/models/display-wallet';
import { IDynamicComponent } from '../dom.controller';

export interface IPasswordPromptConfig {
  wallet: DisplayWallet;
}

@Component({
  selector: 'password-prompt',
  templateUrl: './password-prompt.component.html',
  styleUrls: ['./password-prompt.component.sass']
})
export class PasswordPromptComponent implements IDynamicComponent {
  destroy: Function;
  private _onDismiss: Function;
  formData: FormGroup;
  ready: boolean;

  get password(): AbstractControl { return this.formData.get('password'); }

  private wallet: DisplayWallet;

  constructor(private formBuilder: FormBuilder) {}

  init(config?: IPasswordPromptConfig) {
    if (config && config.wallet) {
      this.wallet = config.wallet;
    }

    const validators = [Validators.required];

    if (this.wallet) {
      // TODO(ibby): validate wallet password
    }

    this.formData = this.formBuilder.group({
      password: ['', validators]
    });

    this.ready = true;
  }

  submitPassword() {
    this._dismiss(this.password.value);
  }

  onDismiss(callback: (password: string) => any) {
    this._onDismiss = callback;
  }

  onBackdropClick() {
    this._dismiss();
  }

  private _dismiss(val?: string) {
    if (typeof this._onDismiss === 'function') {
      this._onDismiss(val);
    }

    this.destroy();
  }
}
