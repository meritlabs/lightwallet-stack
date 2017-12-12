import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { CreateVaultService } from "merit/vaults/create-vault/create-vault.service";

@IonicPage({
  defaultHistory: ['WalletsView']
})
@Component({
  selector: 'view-create-vault-summary',
  templateUrl: 'vault-summary.html',
})
export class CreateVaultSummaryView {
  
  public formData = { vaultName: '', whitelist: [], amountToDeposit: 0.0, masterKey: '' };

  constructor(
    private navCtrl:NavController,
    private createVaultService: CreateVaultService,
  ){}

  ionViewDidLoad() {
    let data = this.createVaultService.getData();
    this.formData.vaultName = data.vaultName;
    this.formData.whitelist = data.whitelist;
    this.formData.amountToDeposit = data.amountToDeposit;
    this.formData.masterKey = data.masterKey;
  }

  create() {
    this.createVaultService.createVault().then(() => {
      this.navCtrl.push('WalletsView');
    });
  }
}