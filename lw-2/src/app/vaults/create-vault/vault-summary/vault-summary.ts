import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ConfigService } from "merit/shared/config.service";


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
  ){}

  create() {
    this.navCtrl.push('WalletsView');
  }
}