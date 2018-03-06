import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ENV } from '@merit/desktop/environments/environment';

@Component({
  selector: 'view-create-wallet',
  templateUrl: './create-wallet.component.html',
  styleUrls: ['./create-wallet.component.scss']
})
export class CreateWalletComponent {

  formData: FormGroup = this.formBuilder.group({
    walletName: ['', Validators.required],
    parentAddress: ['', Validators.required],
    alias: '',
    bwsurl: [ENV.mwsUrl, Validators.required],
    recoveryPhrase: '',
    password: '',
    repeatPassword: '',
    color: '',
    hideBalance: false
  });

  constructor(private formBuilder: FormBuilder) {
  }

  async create() {
    console.log('Creating wallet ... ', this.formData.getRawValue());
  }
}
