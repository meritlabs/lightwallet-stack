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
  constructor(
    private navCtrl:NavController,
  ){}

  toVautlSummary() {
    this.navCtrl.push('CreateVaultSummaryView');
  }
}