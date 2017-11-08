import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ConfigService } from "merit/shared/config.service";


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
  ){}

  toVautlSummary() {
    this.navCtrl.push('CreateVaultSummaryView');
  }
}