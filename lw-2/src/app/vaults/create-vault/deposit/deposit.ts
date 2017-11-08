import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ConfigService } from "merit/shared/config.service";


@IonicPage({
  defaultHistory: ['ProfileView']
})
@Component({
  selector: 'view-create-vault-deposit',
  templateUrl: 'deposit.html',
})
export class CreateVaultDepositView {

  public formData = { amountToDeposit: 0.0, amountAvailable: 10000.0 };

  constructor(
    private navCtl: NavController,
    private navParams: NavParams,
  ) {}

  toMasterKey() {
    this.navCtl.push('CreateVaultMasterKeyView');
  }
}