import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ConfigService } from "merit/shared/config.service";
import { CreateVaultService } from "merit/vaults/create-vault/create-vault.service";

@IonicPage({
  defaultHistory: ['ProfileView']
})
@Component({
  selector: 'view-create-vault-summary',
  templateUrl: 'vault-summary.html',
})
export class CreateVaultSummaryView {
  
  public formData = { vaultName: 'My Vault Name', whitelist: [], amountToDeposit: 100.0, masterKey: "My Master Key" };

  constructor(
    private navCtrl:NavController,
    private navParams: NavParams,
    private createVaultService: CreateVaultService,
  ){}

  create() {
    this.createVaultService.createVault().then( () => {
      this.navCtrl.push('WalletsView');
    });
  }
}