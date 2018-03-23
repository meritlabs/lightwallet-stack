import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DisplayWallet } from '@merit/common/models/display-wallet';
import { IDynamicComponent } from '../dom.controller';

export interface IPasswordPromptConfig {
  wallet: DisplayWallet;
}

@Component({
  selector: 'app-password-prompt',
  templateUrl: './password-prompt.component.html',
  styleUrls: ['./password-prompt.component.scss']
})
export class PasswordPromptComponent implements IDynamicComponent {
  destroy: Function;
  onDismiss: Function;
  formData: FormGroup;
  ready: boolean;

  get password(): AbstractControl { return this.formData.get('password'); }

  private wallet: DisplayWallet;

  constructor(private formBuilder: FormBuilder) {}

  private init() {
    this.formData = this.formBuilder.group({
      password: ['', [Validators.required]] // TODO(ibby): validate wallet password
    });

    this.ready = true;
  }

  setConfig(config: IPasswordPromptConfig) {
    this.wallet = config.wallet;
    this.init();
  }

  submitPassword() {
    if (typeof this.onDismiss === 'function') {
      this.onDismiss(this.password.value);
    }

    this.destroy();
  }
}
