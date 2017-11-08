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
  constructor(
    private navCtl: NavController,
    private navParams: NavParams,
  ) {}

  toMasterKey() {
    this.navCtl.push('CreateVaultMasterKeyView');
  }
}