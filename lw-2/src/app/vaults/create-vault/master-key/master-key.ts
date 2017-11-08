import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ConfigService } from "merit/shared/config.service";
import { CreateVaultService } from "merit/vaults/create-vault/create-vault.service";

@IonicPage({
  defaultHistory: ['ProfileView']
})
@Component({
  selector: 'view-create-vault-master-key',
  templateUrl: 'master-key.html',
})
export class CreateVaultMasterKeyView {

  public formData = { masterKey: "My Master Key" };

  constructor(
    private navCtrl:NavController,
    private navParams: NavParams,
    private createVaultService: CreateVaultService,
  ){}

  ionViewDidLoad() {
    let data = this.createVaultService.getData();
    this.formData.masterKey = data.masterKey;
  }

  toVautlSummary() {
    this.navCtrl.push('CreateVaultSummaryView');
  }
}