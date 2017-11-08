import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ConfigService } from "merit/shared/config.service";
import { CreateVaultService } from "merit/vaults/create-vault/create-vault.service";

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
    private createVaultService: CreateVaultService,
  ) {}

  ionViewDidLoad() {
    let data = this.createVaultService.getData();
    this.formData.amountToDeposit = data.amountToDeposit;
    this.formData.amountAvailable = data.amountAvailable;
  }

  toMasterKey() {
    this.createVaultService.updateData(this.formData);
    this.navCtl.push('CreateVaultMasterKeyView');
  }
}