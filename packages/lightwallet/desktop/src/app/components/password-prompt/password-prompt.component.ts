import { Component } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { DisplayWallet } from '@merit/common/models/display-wallet';
import { IDynamicComponent } from '../dom.controller';

export interface IPasswordPromptConfig {
  // wallet: DisplayWallet;
  title: string;
  validators: ValidatorFn[];
  asyncValidators: AsyncValidatorFn[];
}

@Component({
  selector: 'password-prompt',
  templateUrl: './password-prompt.component.html',
  styleUrls: ['./password-prompt.component.sass'],
})
export class PasswordPromptComponent implements IDynamicComponent {
  destroy: Function;
  private _onDismiss: Function;
  formData: FormGroup;
  ready: boolean;
  title: string;

  get password(): AbstractControl {
    return this.formData.get('password');
  }

  constructor(private formBuilder: FormBuilder) {}

  init(config?: IPasswordPromptConfig) {
    this.title = config.title;

    this.formData = this.formBuilder.group({
      password: ['', config.validators, config.asyncValidators],
    });

    this.ready = true;
  }

  submitPassword() {
    this._dismiss(this.password.value);
  }

  onDidDismiss(callback: (password: string) => any) {
    this._onDismiss = callback;
  }

  onBackdropClick() {
    this._dismiss();
  }

  private _dismiss(val?: string) {
    if (typeof this._onDismiss === 'function') {
      this._onDismiss(val);
    }

    if (typeof this.destroy === 'function') {
      this.destroy();
    }
  }
}
