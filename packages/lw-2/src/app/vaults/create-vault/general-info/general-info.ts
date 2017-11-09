import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ConfigService } from "merit/shared/config.service";
import { CreateVaultService } from "merit/vaults/create-vault/create-vault.service";

@IonicPage({
  defaultHistory: ['ProfileView']
})
@Component({
  selector: 'view-create-vault-general',
  templateUrl: 'general-info.html',
})
export class CreateVaultGeneralInfoView {

  public formData = { vaultName: '', whitelist: [] };
  public isNextAvailable = false;

  constructor(
    private navCtrl:NavController,
    private navParams: NavParams, 
    private createVaultService: CreateVaultService, 
  ){}

  checkNextAvailable() {
    this.isNextAvailable = this.formData.vaultName.length > 0;
  }

  ionViewDidLoad() {
    let data = this.createVaultService.getData();
    this.formData.vaultName = data.vaultName;
    this.formData.whitelist = data.whitelist;
  }

  toDeposit() {
    console.log(this.formData);
    this.createVaultService.updateData(this.formData);
    this.navCtrl.push('CreateVaultDepositView');
  }
}