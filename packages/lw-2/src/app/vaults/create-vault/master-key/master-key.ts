import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ConfigService } from "merit/shared/config.service";
import { CreateVaultService } from "merit/vaults/create-vault/create-vault.service";
import { PopupService } from "merit/core/popup.service";

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
    private popupService: PopupService,
  ){}

  ionViewDidLoad() {
    let data = this.createVaultService.getData();
    this.formData.masterKey = data.masterKey;
  }

  confirm() {
    let confirm = () => {
      this.toVautlSummary();
    };
    this.popupService.ionicConfirm('Master key', 'Did you copy the master key?', 'Yes', 'No', confirm.bind(this));
  }

  toVautlSummary() {
    this.navCtrl.push('CreateVaultSummaryView');
  }
}